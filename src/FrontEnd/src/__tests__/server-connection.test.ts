/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HexServerConnection } from '../domain/engine';
import { HubConnectionState } from '@microsoft/signalr';
import { mockLocation, restoreLocation } from './helpers/location';
import ServerConnection from '../utilities/server-connection';
import gameState from './fixtures/gameState.json';

jest.mock('@microsoft/signalr');

describe('Gameserver Connection Tests', () => {
  const signalR = require('@microsoft/signalr');

  const createHubConnection = (state: HubConnectionState) => ({
    start: jest.fn().mockResolvedValue(true),
    on: jest.fn().mockResolvedValue(true),
    stop: jest.fn().mockResolvedValue(true),
    off: jest.fn().mockResolvedValue(true),
    onreconnecting: jest.fn(),
    onreconnected: jest.fn(),
    onclose: jest.fn(),
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
  let serverConnection: HexServerConnection;

  beforeEach(function () {
    // eslint-disable-next-line no-undef
    global.fetch = jest
      .fn()
      .mockImplementation(() => ({ ok: true, json: jest.fn().mockResolvedValue(gameState) }));

    hubConnection = createHubConnection(HubConnectionState.Connected);

    signalR.HubConnection = jest.fn(() => hubConnection);
    signalR.HubConnectionBuilder = builder;
    updateHandler.mockReset();
    opponentSelectionHandler.mockReset();
    serverConnection = new ServerConnection('33', updateHandler, opponentSelectionHandler);
  });

  test(`connectGame connects to hub for game id`, async () => {
    global.window.history.replaceState({ gameId: 33 }, document.title, `/game/33`);

    await serverConnection.connectGame();
    await serverConnection.getConnectionState();
    expect(signalRWithUrlMock).toBeCalledWith('http://localhost/gamehub/33');
  });

  test(`web socket connection state can be retrieved`, async () => {
    await serverConnection.connectGame();
    await serverConnection.getConnectionState();
    expect(hubConnection.start).toBeCalled();
  });

  test(`web socket connection can be closed`, async () => {
    await serverConnection.connectGame();
    await serverConnection.getConnectionState();
    await serverConnection.closeConnection();
    expect(hubConnection.off).toBeCalledTimes(1);
    expect(hubConnection.stop).toBeCalledTimes(1);
  });

  test(`opponentSelection is update`, async () => {
    await serverConnection.connectGame();

    expect(hubConnection.on).toHaveBeenLastCalledWith('OpponentSelection', opponentSelectionHandler);
  });

  test(`connection state is disconnected initially`, async () => {
    hubConnection = createHubConnection(HubConnectionState.Disconnected);
    signalR.HubConnection = jest.fn(() => hubConnection);
    serverConnection = new ServerConnection('33', updateHandler, opponentSelectionHandler);
    expect(serverConnection.getConnectionState()).toBe(HubConnectionState.Disconnected);
  });

  test(`connection has connected state`, async () => {
    await serverConnection.connectGame();
    await serverConnection.closeConnection();
    expect(serverConnection.getConnectionState()).toBe(HubConnectionState.Connected);
  });

  test(`debugging connection handlers are called`, async () => {
    const location = mockLocation({ reload: jest.fn() });
    global.console.info = jest.fn();
    await serverConnection.connectGame();

    expect(hubConnection.onclose).toBeCalled();
    expect(hubConnection.onreconnected).toBeCalled();
    expect(hubConnection.onreconnecting).toBeCalled();

    const onReconnectedHandler = hubConnection.onreconnected.mock.calls[0][0];
    onReconnectedHandler('test error');

    expect(location.reload).toBeCalled();
    expect(global.console.info).toBeCalled();

    restoreLocation();
  });
});
