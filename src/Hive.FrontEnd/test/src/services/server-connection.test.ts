import signalR, { HubConnectionState } from '@microsoft/signalr';
import { serverConnectionFactory } from '../../../src/services';
import gameState from '../../fixtures/game-state.json';
import { mockLocation } from '../../helpers';

const { HubConnectionBuilder, HubConnection } = await vi.importMock('@microsoft/signalr');

global.console.info = vi.fn();
global.console.warn = vi.fn();
global.console.error = vi.fn();

describe('game Server Connection Tests', () => {
  type TestHubConnection = ReturnType<typeof createHubConnection>;
  type CallBack = (error: Error) => void;

  const withUrlSpy = vi.fn().mockReturnThis();
  const updateHandler = vi.fn();
  const opponentSelectionHandler = vi.fn();
  const opponentConnectedHandler = vi.fn();

  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: Promise.resolve(gameState) });

  const createHubConnectionBuilder = (hubConnection: TestHubConnection) =>
    HubConnectionBuilder.mockImplementation(() => ({
      withUrl: withUrlSpy,
      withAutomaticReconnect: vi.fn().mockReturnThis(),
      build: vi.fn().mockReturnValue(hubConnection),
    }));

  const createHubConnection = (state: HubConnectionState = HubConnectionState.Connected) => {
    return {
      start: vi.fn().mockResolvedValue(true),
      on: vi.fn().mockResolvedValue(true),
      stop: vi.fn().mockResolvedValue(true),
      off: vi.fn().mockResolvedValue(true),
      onreconnecting: (callBack: CallBack) => callBack(new Error('reconnecting error')),
      onreconnected: (callBack: CallBack) => callBack(new Error('reconnected error')),
      onclose: (callBack: CallBack) => callBack(new Error('close error')),
      invoke: vi.fn().mockResolvedValue(true),
      send: vi.fn().mockResolvedValue(true),
      state,
    };
  };

  const setupServer = (hubConnection: TestHubConnection) => {
    HubConnection.mockReset().mockImplementation(() => hubConnection);
    createHubConnectionBuilder(hubConnection);

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

    HubConnection.mockImplementation(() => hubConnection);
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
    const restoreLocation = mockLocation({ reload: vi.fn() });

    const hubConnection = createHubConnection();
    const serverConnection = setupServer(hubConnection);

    await serverConnection.connectGame();

    expect(console.info).toHaveBeenCalledWith(`connection closed to game 33 .. Error: close error`);
    expect(console.info).toHaveBeenCalledWith('reconnected to game 33 .. Error: reconnected error');
    expect(console.warn).toHaveBeenCalledWith('reconnecting to game 33 .. Error: reconnecting error');

    restoreLocation();
  });
});
