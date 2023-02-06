import GameEngine from '../../../src/services/game-engine';
import gameState from '../../fixtures/game-state.json';

describe('game engine Tests', () => {
  let engine: GameEngine;
  global.fetch = vi
    .fn()
    .mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }));

  it('creates new game', async () => {
    engine = new GameEngine();
    const response = await engine.initialGame;

    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  it('gets existing game', async () => {
    engine = new GameEngine({ gameId: '33', currentPlayer: '1' });
    const response = await engine.initialGame;

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
    engine = new GameEngine({ gameId: '33', currentPlayer: '1' });
    const response = await engine.move({
      tileId: 1,
      coords: { q: 0, r: 0 },
    });

    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  it('AI move made for player 1', async () => {
    engine = new GameEngine({ gameId: '445', currentPlayer: '0' });
    engine.getAiMode().value = 'on';
    await engine.move({
      tileId: 1,
      coords: { q: 0, r: 0 },
    });

    expect(global.fetch).toHaveBeenLastCalledWith('/api/ai-move/445/1', expect.any(Object));
  });

  it('AI move made for player 0', async () => {
    engine = new GameEngine({ gameId: '445', currentPlayer: '1' });
    engine.getAiMode().value = 'on';
    await engine.move({
      tileId: 1,
      coords: { q: 0, r: 0 },
    });

    expect(global.fetch).toHaveBeenLastCalledWith('/api/ai-move/445/0', expect.any(Object));
  });

  it('No AI move on toggle off', async () => {
    engine = new GameEngine({ gameId: '445', currentPlayer: '0' });
    engine.getAiMode().value = 'off';

    expect(global.fetch).not.toHaveBeenCalledWith(/api\/ai-move/, expect.any(Object));
  });

  it('gets Ai Mode', async () => {
    engine = new GameEngine({ gameId: '445', currentPlayer: '0' });

    expect(engine.getAiMode().value).toStrictEqual('on');
  });
});
