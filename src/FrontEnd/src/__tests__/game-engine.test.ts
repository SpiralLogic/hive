/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HexServerConnection } from '../domain/engine';
import { HubConnectionState } from '@microsoft/signalr';
import Engine from '../utilities/game-engine';
import gameState from './fixtures/gameState.json';

jest.mock('@microsoft/signalr');
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
describe('Game Engine Tests', () => {
  let engine: Engine;
  beforeEach(function () {
    // eslint-disable-next-line no-undef
    global.fetch = jest
      .fn()
      .mockImplementation(() => ({ ok: true, json: jest.fn().mockResolvedValue(gameState) }));
    engine = new Engine();
  });

  test('new game', async () => {
    const response = await engine.getNewGame();
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  test('existing game', async () => {
    const response = await engine.getExistingGame('33');
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
    const response = await engine.moveTile('1', {
      tileId: 1,
      coords: { q: 0, r: 0 },
    });
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });
});
