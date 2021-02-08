import { GameState } from '../domain';
import { MoveEvent, useHiveEventEmitter } from '../emitters';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import { renderElement } from './helpers';
import App from '../components/App';
import Engine from '../game-engine';
import GameArea from '../components/GameArea';

jest.mock('../game-engine');
jest.mock('../components/GameArea');

const cellMoveEvent: MoveEvent = {
  move: { coords: { q: 1, r: 1 }, tileId: 1 },
  type: 'move',
};

describe('App', () => {
  let gameState: GameState;
  beforeEach(() => {
    global.window.history.replaceState({}, global.document.title, `/`);
    const cell = {
      coords: { q: 0, r: 0 },
      tiles: [{ id: 2, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
    };
    const player = { id: 0, name: 'Player 1', tiles: [] };
    const player2 = {
      id: 1,
      name: 'Player 2',
      tiles: [{ id: 1, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
    };
    gameState = { gameId: '33', cells: [cell], players: [player, player2] };
    const gameAfterMove = {
      cells: [cell, cell],
      players: [player, player],
    };
    Engine.getGame = jest.fn().mockResolvedValue(gameState);
    Engine.newGame = jest.fn().mockResolvedValue(gameState);
    Engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
    Engine.connectGame = jest.fn().mockReturnValue({ closeConnection: jest.fn() });
  });

  test('shows loading', () => {
    const app = renderElement(<App />);
    expect(app).toMatchSnapshot();
  });

  test('shows game when loaded', async () => {
    const app = render(<App />);
    await Engine.newGame();
    expect(GameArea).toHaveBeenCalledTimes(1);
  });

  test('connects to server', async () => {
    const app = render(<App />);
    await Engine.newGame();
    app.rerender(<App />);
    expect(Engine.connectGame).toHaveBeenCalledTimes(1);
  });

  test('loads existing game', async () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const app = render(<App />);
    await Engine.getGame;
    app.rerender(<App />);
    expect(Engine.getGame).toHaveBeenCalled();
  });

  test('updates game after move', async () => {
    const app = render(<App />);
    await Engine.getGame;

    app.rerender(<App />);
    expect(GameArea).toHaveBeenLastCalledWith(expect.objectContaining({ gameState }), {});
  });

  test('removes moves for tiles which are the current player', async () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    const app = render(<App />);
    await Engine.getGame;
    app.rerender(<App />);
    gameState.players[1].tiles[0].moves = [];
    gameState.cells[0].tiles[0].moves = [];
    expect(GameArea).toHaveBeenLastCalledWith(expect.objectContaining({ gameState }), {});
  });

  test('calls update game on cell drop', async () => {
    const app = render(<App />);
    await Engine.newGame();
    app.rerender(<App />);
    useHiveEventEmitter().emit(cellMoveEvent);

    expect(Engine.moveTile).toHaveBeenCalledTimes(1);
  });

  test('renders new state on cell drop', async () => {
    const app = render(<App />);
    await Engine.newGame();
    app.rerender(<App />);

    useHiveEventEmitter().emit(cellMoveEvent);

    expect(GameArea).toHaveBeenCalledTimes(2);
  });
});
