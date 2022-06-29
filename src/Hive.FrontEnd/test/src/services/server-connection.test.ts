import signalR, { HubConnectionState } from '@microsoft/signalr';
import { serverConnectionFactory } from '../../../src/services';
import gameState from '../../fixtures/game-state.json';
import { mockLocation } from '../../helpers';

jest.mock('@microsoft/signalr', () => ({
  ...jest.requireActual('@microsoft/signalr'),
  HubConnection: jest.fn(),
  HubConnectionBuilder: jest.fn(),
}));

global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

describe('game Server Connection Tests', () => {
  type TestHubConnection = ReturnType<typeof createHubConnection>;
  type CallBack = (error: Error) => void;

  const withUrlSpy = jest.fn().mockReturnThis();
  const updateHandler = jest.fn();
  const opponentSelectionHandler = jest.fn();
  const opponentConnectedHandler = jest.fn();

  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: Promise.resolve(gameState) });

  const createHubConnectionBuilder = (hubConnection: TestHubConnection) =>
    jest.fn().mockImplementation(() => ({
      withUrl: withUrlSpy,
      withAutomaticReconnect: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(hubConnection),
    }));

  const createHubConnection = (state: HubConnectionState = HubConnectionState.Connected) => {
    return {
      start: jest.fn().mockResolvedValue(true),
      on: jest.fn().mockResolvedValue(true),
      stop: jest.fn().mockResolvedValue(true),
      off: jest.fn().mockResolvedValue(true),
      onreconnecting: (callBack: CallBack) => callBack(new Error('reconnecting error')),
      onreconnected: (callBack: CallBack) => callBack(new Error('reconnected error')),
      onclose: (callBack: CallBack) => callBack(new Error('close error')),
      invoke: jest.fn().mockResolvedValue(true),
      send: jest.fn().mockResolvedValue(true),
      state,
    };
  };

  const setupServer = (hubConnection: TestHubConnection) => {
    signalR.HubConnection = jest.fn().mockImplementation(() => hubConnection);
    signalR.HubConnectionBuilder = createHubConnectionBuilder(hubConnection);

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

  it(`connects to hub for game id`, async () => {
    global.window.history.replaceState({ gameId: 33 }, document.title, `/game/33/0`);

    const hubConnection = createHubConnection();
    const serverConnection = setupServer(hubConnection);

    await serverConnection.connectGame();
    serverConnection.getConnectionState();

    expect(withUrlSpy).toHaveBeenCalledWith('http://localhost/gamehub/33/0', {
      skipNegotiation: true,
      transport: 1,
    });
  });

  it(`can retrieve web socket connection state`, async () => {
    const hubConnection = createHubConnection();
    const serverConnection = setupServer(hubConnection);
    await serverConnection.connectGame();

    serverConnection.getConnectionState();

    expect(hubConnection.start).toHaveBeenCalledWith();
  });

  it(`closes web socket connections`, async () => {
    const hubConnection = createHubConnection();
    const serverConnection = setupServer(hubConnection);
    await serverConnection.connectGame();

    serverConnection.getConnectionState();
    await serverConnection.closeConnection();

    expect(hubConnection.off).toHaveBeenCalledTimes(1);
    expect(hubConnection.stop).toHaveBeenCalledTimes(1);
  });

  it(`updates opponentSelection`, async () => {
    const hubConnection = createHubConnection();
    const serverConnection = setupServer(hubConnection);
    await serverConnection.connectGame();

    expect(hubConnection.on).toHaveBeenLastCalledWith('PlayerConnection', opponentConnectedHandler);
  });

  it(`starts with a connection disconnected state`, async () => {
    const hubConnection = createHubConnection(HubConnectionState.Disconnected);
    const serverConnection = setupServer(hubConnection);

    signalR.HubConnection = jest.fn().mockImplementation(() => hubConnection);
    expect(serverConnection.getConnectionState()).toStrictEqual(HubConnectionState.Disconnected);
  });

  it(`invokes sendSelection on server`, async () => {
    const hubConnection = createHubConnection();
    const serverConnection = setupServer(hubConnection);

    serverConnection.sendSelection('select', { id: 1, playerId: 1, creature: 'duck', moves: [] });
    expect(hubConnection.send).toHaveBeenCalledWith('SendSelection', 'select', {
      creature: 'duck',
      id: 1,
      moves: [],
      playerId: 1,
    });
  });

  it(`doesn't invoke sendSelection when not connected`, async () => {
    const hubConnection = createHubConnection(HubConnectionState.Disconnected);
    const serverConnection = setupServer(hubConnection);

    serverConnection.sendSelection('select', { id: 1, playerId: 1, creature: 'duck', moves: [] });
    expect(hubConnection.send).not.toHaveBeenCalledWith();
  });

  it(`server connection errors handlers are connected to the console`, async () => {
    const restoreLocation = mockLocation({ reload: jest.fn() });

    const hubConnection = createHubConnection();
    const serverConnection = setupServer(hubConnection);

    await serverConnection.connectGame();

    expect(console.info).toHaveBeenCalledWith(`connection closed to game 33 .. Error: close error`);
    expect(console.info).toHaveBeenCalledWith('reconnected to game 33 .. Error: reconnected error');
    expect(console.warn).toHaveBeenCalledWith('reconnecting to game 33 .. Error: reconnecting error');

    restoreLocation();
  });
});
