import GameEngine, { StaleGameStateError } from '../../../src/services/game-engine';
import gameState from '../../fixtures/game-state.json';

describe('game engine', () => {
  let engine: GameEngine;
  beforeEach(() => {
    globalThis.fetch = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }));
  });

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

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/game/33', {
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

  it('moves tile', async () => {
    engine = new GameEngine({ gameId: '33', currentPlayer: '1' });
    const response = await engine.move({
      tileId: 1,
      coords: { q: 0, r: 0 },
    });

    expect(response).not.toBeFalsy();
    expect(response.cells).toHaveLength(2);
    expect(response.players).toHaveLength(2);
    expect(globalThis.fetch).toHaveBeenLastCalledWith('/api/move/33', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'If-Match-Version': '3',
      },
      body: JSON.stringify({
        tileId: 1,
        coords: { q: 0, r: 0 },
      }),
    });
  });

  it.each(['0', '1'])('makes AI move for player %s', async (player) => {
    engine = new GameEngine({ gameId: '445', currentPlayer: player });
    engine.aiMode = 'on';
    await engine.move({
      tileId: 1,
      coords: { q: 0, r: 0 },
    });

    expect(globalThis.fetch).toHaveBeenLastCalledWith('/api/ai-move/445', expect.any(Object));
  });

  it('No AI move on toggle off', async () => {
    engine = new GameEngine({ gameId: '445', currentPlayer: '0' });
    engine.aiMode = 'off';

    expect(globalThis.fetch).not.toHaveBeenCalledWith(/api\/ai-move/, expect.any(Object));
  });

  it('gets Ai Mode', async () => {
    engine = new GameEngine({ gameId: '445', currentPlayer: '0' });

    expect(engine.aiMode).toStrictEqual('on');
  });

  it('performs Ai moves for both players', async () => {
    globalThis.fetch = vi
      .fn()
      .mockReset()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }))
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }));

    engine = new GameEngine({ gameId: '445', currentPlayer: '0' });
    engine.aiMode = 'auto';
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/ai-move/445', expect.any(Object));
    expect((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('throws stale error when server returns conflict', async () => {
    globalThis.fetch = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }))
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: false, status: 409, json: () => Promise.resolve({}) })
      );

    engine = new GameEngine({ gameId: '33', currentPlayer: '1' });
    await expect(
      engine.move({
        tileId: 1,
        coords: { q: 0, r: 0 },
      })
    ).rejects.toBeInstanceOf(StaleGameStateError);
  });
});
