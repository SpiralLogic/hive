/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HubConnectionState } from '@microsoft/signalr';
import GameEngine from '../../services/game-engine';
import gameState from '../fixtures/gameState.json';
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

describe('Game Engine Tests', () => {
  let engine: GameEngine;
  beforeEach(function () {
    global.fetch = jest
      .fn()
      .mockImplementation(() => ({ ok: true, json: jest.fn().mockResolvedValue(gameState) }));
    engine = new GameEngine();
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
