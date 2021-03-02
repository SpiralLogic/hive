/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HubConnectionState } from '@microsoft/signalr';
import { mockLocation, restoreLocation } from './helpers/location';
import Engine from '../utilities/game-engine';
import gameState from './fixtures/gameState.json';

jest.mock('@microsoft/signalr');

describe('GameEngine Tests', () => {
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

  beforeEach(function () {
    // eslint-disable-next-line no-undef
    global.fetch = jest
      .fn()
      .mockImplementation(() => ({ ok: true, json: jest.fn().mockResolvedValue(gameState) }));

    hubConnection = createHubConnection(HubConnectionState.Connected);

    signalR.HubConnection = jest.fn(() => hubConnection);
    signalR.HubConnectionBuilder = builder;
  });

  test('new game', async () => {
    const response = await Engine.getNewGame();
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  test('existing game', async () => {
    const response = await Engine.getExistingGame('33');
    expect(global.fetch).toBeCalledWith('/api/game/33', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  test('move tile', async () => {
    const response = await Engine.moveTile('1', {
      tileId: 1,
      coords: { q: 0, r: 0 },
    });
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  test(`connectGame connects to hub for game id`, async () => {
    global.window.history.replaceState({ gameId: 667 }, document.title, `/game/667`);

    const updateGameState = jest.fn();
    const { getConnectionState } = Engine.connectGame('667', { updateGameState });
    await getConnectionState();
    expect(signalRWithUrlMock).toBeCalledWith('http://localhost/gamehub/667');
  });

  test(`web socket connection state can be retrieved`, async () => {
    const updateGameState = jest.fn();
    const { getConnectionState } = Engine.connectGame('33', { updateGameState });
    await getConnectionState();
    expect(hubConnection.start).toBeCalled();
  });

  test(`web socket connection can be closed`, async () => {
    const updateGameState = jest.fn();
    const { getConnectionState, closeConnection } = Engine.connectGame('33', { updateGameState });
    await getConnectionState();
    await closeConnection();
    expect(hubConnection.off).toBeCalledTimes(1);
    expect(hubConnection.stop).toBeCalledTimes(1);
  });

  test(`opponentSelection is update`, async () => {
    const updateGameState = jest.fn();
    const opponentSelection = jest.fn();
    Engine.connectGame('33', { updateGameState, opponentSelection });

    expect(hubConnection.on).toHaveBeenLastCalledWith('OpponentSelection', opponentSelection);
  });

  test(`connection state is disconnected initially`, async () => {
    const updateGameState = jest.fn();
    hubConnection = createHubConnection(HubConnectionState.Disconnected);
    signalR.HubConnection = jest.fn(() => hubConnection);
    const { getConnectionState } = Engine.connectGame('33', { updateGameState });
    expect(getConnectionState()).toBe(HubConnectionState.Disconnected);
  });

  test(`connection has connected state`, async () => {
    const updateGameState = jest.fn();
    const { getConnectionState, closeConnection } = Engine.connectGame('33', { updateGameState });
    await closeConnection();
    expect(getConnectionState()).toBe(HubConnectionState.Connected);
  });

  test(`debugging connection handlers are called`, async () => {
    const updateGameState = jest.fn();
    global.console.info = jest.fn();
    const location = mockLocation({ reload: jest.fn() });
    Engine.connectGame('33', { updateGameState });

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
