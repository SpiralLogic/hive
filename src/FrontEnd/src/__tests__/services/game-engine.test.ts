import GameEngine from '../../services/game-engine';
import gameState from '../fixtures/gameState.json';

describe('game Engine Tests', () => {
  let engine: GameEngine;
  global.fetch = jest.fn();
  jest
    .spyOn(global, 'fetch')
    .mockImplementation()
    .mockImplementation(
      jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(gameState) })
    );
  engine = new GameEngine('game', '33', '1');

  it('new game', async () => {
    const response = await engine.getNewGame();
    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
  });

  it('existing game', async () => {
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
});
