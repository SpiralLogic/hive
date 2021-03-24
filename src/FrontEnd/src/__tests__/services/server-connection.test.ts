import { HexServerConnection } from '../../domain/engine';
import { HubConnectionState } from '@microsoft/signalr';
import { mockLocation, restoreLocation } from '../helpers';
import ServerConnection from '../../services/server-connection';
import gameState from '../fixtures/gameState.json';

jest.mock('@microsoft/signalr');

describe('game Server Connection Tests', () => {
  const signalR = require('@microsoft/signalr');

  const createHubConnection = (state: HubConnectionState) => ({
    start: jest.fn().mockResolvedValue(true),
    on: jest.fn().mockResolvedValue(true),
    stop: jest.fn().mockResolvedValue(true),
    off: jest.fn().mockResolvedValue(true),
    onreconnecting: jest.fn(),
    onreconnected: jest.fn(),
    onclose: jest.fn(),
    invoke: jest.fn().mockResolvedValue(true),
    state: state,
  });

  let hubConnection: ReturnType<typeof createHubConnection>;
  const signalRWithUrlMock = jest.fn().mockReturnThis();
  const builder = jest.fn().mockImplementation(() => ({
    withUrl: signalRWithUrlMock,
    withAutomaticReconnect: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue(hubConnection),
  }));

  const updateHandler = jest.fn();
  const opponentSelectionHandler = jest.fn();
  const opponentConnectionHandler = jest.fn();
  let serverConnection: HexServerConnection;

  beforeEach(function () {
    // eslint-disable-next-line no-undef
    global.fetch = jest
      .fn()
      .mockImplementation(() => ({ ok: true, json: jest.fn().mockResolvedValue(gameState) }));

    hubConnection = createHubConnection(HubConnectionState.Connected);

    jest.spyOn(signalR, 'HubConnection').mockImplementation(() => hubConnection);
    signalR.HubConnectionBuilder = builder;
    updateHandler.mockReset();
    opponentSelectionHandler.mockReset();
    serverConnection = new ServerConnection(
      0,
      '33',
      updateHandler,
      opponentSelectionHandler,
      opponentConnectionHandler
    );
  });

  test(`connectGame connects to hub for game id`, async () => {
    global.window.history.replaceState({ gameId: 33 }, document.title, `/game/33/0`);

    await serverConnection.connectGame();
    await serverConnection.getConnectionState();
    expect(signalRWithUrlMock).toHaveBeenCalledWith('http://localhost/gamehub/33/0');
  });

  test(`web socket connection state can be retrieved`, async () => {
    await serverConnection.connectGame();
    await serverConnection.getConnectionState();
    expect(hubConnection.start).toHaveBeenCalledWith();
  });

  test(`web socket connection can be closed`, async () => {
    await serverConnection.connectGame();
    await serverConnection.getConnectionState();
    await serverConnection.closeConnection();
    expect(hubConnection.off).toHaveBeenCalledTimes(1);
    expect(hubConnection.stop).toHaveBeenCalledTimes(1);
  });

  test(`opponentSelection is updated`, async () => {
    await serverConnection.connectGame();

    expect(hubConnection.on).toHaveBeenLastCalledWith('PlayerConnection', opponentConnectionHandler);
  });

  test(`connection state is disconnected initially`, async () => {
    hubConnection = createHubConnection(HubConnectionState.Disconnected);
    jest.spyOn(signalR, 'HubConnection').mockImplementation(() => hubConnection);
    serverConnection = new ServerConnection(
      0,
      '33',
      updateHandler,
      opponentSelectionHandler,
      opponentConnectionHandler
    );
    expect(serverConnection.getConnectionState()).toBe(HubConnectionState.Disconnected);
  });

  test(`connection has connected state`, async () => {
    await serverConnection.connectGame();
    await serverConnection.closeConnection();
    expect(serverConnection.getConnectionState()).toBe(HubConnectionState.Connected);
  });

  test(`sendSelection invokes on server`, async () => {
    serverConnection.sendSelection('select', { id: 1, playerId: 1, creature: 'duck', moves: [] });
    expect(hubConnection.invoke).toHaveBeenCalledWith('SendSelection', 'select', {
      creature: 'duck',
      id: 1,
      moves: [],
      playerId: 1,
    });
  });

  test(`sendSelection doesn't send without being connected`, async () => {
    hubConnection = createHubConnection(HubConnectionState.Disconnected);
    serverConnection.sendSelection('select', { id: 1, playerId: 1, creature: 'duck', moves: [] });
    expect(hubConnection.invoke).not.toHaveBeenCalledWith();
  });

  test(`connection has connected state`, async () => {
    await serverConnection.connectGame();
    await serverConnection.closeConnection();
    expect(serverConnection.getConnectionState()).toBe(HubConnectionState.Connected);
  });

  test(`debugging connection handlers are called`, async () => {
    const location = mockLocation({ reload: jest.fn() });
    jest.spyOn(global.console, 'info').mockImplementation();
    jest.spyOn(global.console, 'warn').mockImplementation();
    jest.spyOn(global.console, 'error').mockImplementation();
    await serverConnection.connectGame();

    expect(hubConnection.onclose).toHaveBeenCalledWith(expect.anything());
    expect(hubConnection.onreconnected).toHaveBeenCalledWith(expect.anything());
    expect(hubConnection.onreconnecting).toHaveBeenCalledWith(expect.anything());

    const onReconnectingHandler = hubConnection.onreconnecting.mock.calls[0][0];
    onReconnectingHandler('test error');
    expect(global.console.warn).toHaveBeenCalledWith(expect.any(String));

    const onCloseHandler = hubConnection.onclose.mock.calls[0][0];
    onCloseHandler('test error');
    expect(global.console.info).toHaveBeenCalledWith(expect.any(String));

    const onReconnectedHandler = hubConnection.onreconnected.mock.calls[0][0];
    onReconnectedHandler('test error');

    expect(location.reload).toHaveBeenCalledWith();
    expect(global.console.info).toHaveBeenCalledWith(expect.any(String));

    restoreLocation();
  });
});
