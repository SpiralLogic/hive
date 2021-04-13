/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { mockLocation } from '../test-helpers';
import { serverConnectionFactory } from '../../src/services';
import gameState from '../fixtures/gameState.json';

jest.mock('@microsoft/signalr');

describe('game Server Connection Tests', () => {
  const signalR = require('@microsoft/signalr');

  const createHubConnection = (state: HubConnectionState) => {
    return {
      start: jest.fn().mockResolvedValue(true),
      on: jest.fn().mockResolvedValue(true),
      stop: jest.fn().mockResolvedValue(true),
      off: jest.fn().mockResolvedValue(true),
      onreconnecting: jest.fn(),
      onreconnected: jest.fn(),
      onclose: jest.fn(),
      invoke: jest.fn().mockResolvedValue(true),
      send: jest.fn().mockResolvedValue(true),
      state: state,
    };
  };

  let hubConnection: ReturnType<typeof createHubConnection>;
  const signalRWithUrlMock = jest.fn().mockReturnThis();
  const builder = jest.fn().mockImplementation(() => ({
    withUrl: signalRWithUrlMock,
    withAutomaticReconnect: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue(hubConnection),
  }));

  const updateHandler = jest.fn();
  const opponentSelectionHandler = jest.fn();
  const opponentConnectedHandler = jest.fn();

  const setupServer = (connection = HubConnectionState.Connected) => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ ok: true, json: Promise.resolve(gameState) }));

    hubConnection = createHubConnection(connection);

    jest.spyOn(signalR, 'HubConnection').mockImplementation(() => hubConnection);
    signalR.HubConnectionBuilder = builder;
    updateHandler.mockReset();
    opponentSelectionHandler.mockReset();
    return serverConnectionFactory({
      currentPlayer: 0,
      gameId: '33',
      updateHandler,
      opponentSelectionHandler,
      opponentConnectedHandler,
    });
  };
  it(`connectGame connects to hub for game id`, async () => {
    global.window.history.replaceState({ gameId: 33 }, document.title, `/game/33/0`);
    const serverConnection = setupServer();
    await serverConnection.connectGame();
    serverConnection.getConnectionState();
    expect(signalRWithUrlMock).toHaveBeenCalledWith('http://localhost/gamehub/33/0');
  });

  it(`web socket connection state can be retrieved`, async () => {
    const serverConnection = setupServer();
    await serverConnection.connectGame();
    serverConnection.getConnectionState();
    expect(hubConnection.start).toHaveBeenCalledWith();
  });

  it(`web socket connection can be closed`, async () => {
    const serverConnection = setupServer();
    await serverConnection.connectGame();
    serverConnection.getConnectionState();
    await serverConnection.closeConnection();
    expect(hubConnection.off).toHaveBeenCalledTimes(1);
    expect(hubConnection.stop).toHaveBeenCalledTimes(1);
  });

  it(`opponentSelection is updated`, async () => {
    const serverConnection = setupServer();
    await serverConnection.connectGame();

    expect(hubConnection.on).toHaveBeenLastCalledWith('PlayerConnection', opponentConnectedHandler);
  });

  it(`connection state is disconnected initially`, async () => {
    jest.spyOn(signalR, 'HubConnection').mockImplementation(() => hubConnection);
    const serverConnection = setupServer(HubConnectionState.Disconnected);
    expect(serverConnection.getConnectionState()).toBe(HubConnectionState.Disconnected);
  });

  it(`sendSelection invokes on server`, async () => {
    const serverConnection = setupServer();
    serverConnection.sendSelection('select', { id: 1, playerId: 1, creature: 'duck', moves: [] });
    expect(hubConnection.send).toHaveBeenCalledWith('SendSelection', 'select', {
      creature: 'duck',
      id: 1,
      moves: [],
      playerId: 1,
    });
  });

  it(`sendSelection doesn't send without being connected`, async () => {
    const serverConnection = setupServer();
    hubConnection = createHubConnection(HubConnectionState.Disconnected);
    serverConnection.sendSelection('select', { id: 1, playerId: 1, creature: 'duck', moves: [] });
    expect(hubConnection.send).not.toHaveBeenCalledWith();
  });

  it(`connection has connected state`, async () => {
    const serverConnection = setupServer();
    await serverConnection.connectGame();
    await serverConnection.closeConnection();
    expect(serverConnection.getConnectionState()).toBe(HubConnectionState.Connected);
  });

  it(`debugging connection handlers are called`, async () => {
    const restore = mockLocation({ reload: jest.fn() });
    jest.spyOn(global.console, 'info').mockImplementation();
    jest.spyOn(global.console, 'warn').mockImplementation();
    jest.spyOn(global.console, 'error').mockImplementation();
    const serverConnection = setupServer();
    await serverConnection.connectGame();

    expect(hubConnection.onclose).toHaveBeenCalledWith(expect.anything());
    expect(hubConnection.onreconnected).toHaveBeenCalledWith(expect.anything());
    expect(hubConnection.onreconnecting).toHaveBeenCalledWith(expect.anything());

    const onReconnectingHandler = hubConnection.onreconnecting.mock.calls[0][0] as (error?: string) => void;
    onReconnectingHandler('test error');
    expect(global.console.warn).toHaveBeenCalledWith(expect.any(String));

    const onCloseHandler = hubConnection.onclose.mock.calls[0][0] as (error?: string) => void;
    onCloseHandler('test error');
    expect(global.console.info).toHaveBeenCalledWith(expect.any(String));

    const onReconnectedHandler = hubConnection.onreconnected.mock.calls[0][0] as (error?: string) => void;
    onReconnectedHandler('test error');

    expect(window.location.reload).toHaveBeenCalledWith();
    expect(global.console.info).toHaveBeenCalledWith(expect.any(String));

    restore();
  });
});
