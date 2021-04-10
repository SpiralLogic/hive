import GameEngine from '../../services/game-engine';
import gameState from '../fixtures/gameState.json';

describe('game Engine Tests', () => {
  let engine: GameEngine;
  global.fetch = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }))
    .mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }));

  it('new game', async () => {
    engine = new GameEngine({ route: 'game', gameId: '33', currentPlayer: '1' });
    const response = await engine.getNewGame();
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  it('existing game', async () => {
    engine = new GameEngine();
    const response = await engine.getExistingGame('33');
    expect(global.fetch).toHaveBeenCalledWith('/api/game/33', {
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

  it('move tile', async () => {
    engine = new GameEngine();
    const response = await engine.move(
      '1',
      {
        tileId: 1,
        coords: { q: 0, r: 0 },
      },
      false
    );
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  it('ai move made for player 1', async () => {
    window.history.pushState({ currentPlayer: 0 }, 'game');
    engine = new GameEngine();
    jest.clearAllMocks();
    await engine.move(
      '1',
      {
        tileId: 1,
        coords: { q: 0, r: 0 },
      },
      true
    );
    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(/.+1$/), expect.any(Object));
  });

  it('ai move made for player 0', async () => {
    window.history.pushState({ currentPlayer: 1 }, 'game');
    engine = new GameEngine();
    jest.clearAllMocks();
    const move = {
      tileId: 1,
      coords: { q: 0, r: 0 },
    };
    await engine.move('1', move, true);
    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(/.+0$/), expect.any(Object));
  });
});
