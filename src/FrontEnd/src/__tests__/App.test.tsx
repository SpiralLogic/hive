import { GameState } from '../domain';
import { HiveEvent, MoveEvent } from '../utilities/hive-dispatcher';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import { renderElement } from './helpers';
import { useHiveDispatcher } from '../utilities/hooks';
import App from '../components/App';
import Engine from '../utilities/game-engine';
import GameArea from '../components/GameArea';

jest.mock('../utilities/game-engine');
jest.mock('../components/GameArea');

describe('App Tests', () => {
  const cellMoveEvent: MoveEvent = {
    move: { coords: { q: 1, r: 1 }, tileId: 1 },
    type: 'move',
  };
  const tileSelectEvent: HiveEvent = {
    type: 'tileSelected',
    tile: { id: 2, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] },
  };
  const tileDeselectEvent: HiveEvent = {
    type: 'tileDeselected',
    tile: { id: 2, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] },
  };
  const gameConnection = {
    closeConnection: jest.fn().mockImplementation(() => ({ then: jest.fn() })),
    sendSelection: jest.fn(),
  };
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
      players: [player, player2],
    };
    Engine.getExistingGame = jest.fn().mockResolvedValue(gameState);
    Engine.getNewGame = jest.fn().mockResolvedValue(gameState);
    Engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
    Engine.connectGame = jest.fn().mockReturnValue(gameConnection);
  });

  test('shows loading', () => {
    const app = renderElement(<App />);
    expect(app).toMatchSnapshot();
  });

  test('shows game when loaded', async () => {
    render(<App />);
    await Engine.getNewGame();
    expect(GameArea).toHaveBeenCalledTimes(1);
  });

  test('connects to server', async () => {
    const app = render(<App />);
    await Engine.getNewGame();
    app.rerender(<App />);
    expect(Engine.connectGame).toHaveBeenCalledTimes(1);
  });

  test('loads existing game', async () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const app = render(<App />);
    await Engine.getExistingGame;
    app.rerender(<App />);
    expect(Engine.getExistingGame).toHaveBeenCalled();
  });

  test('updates game after move', async () => {
    const app = render(<App />);
    await Engine.getExistingGame;

    app.rerender(<App />);
    expect(GameArea).toHaveBeenLastCalledWith(
      expect.objectContaining({ players: gameState.players, cells: gameState.cells, playerId: 0 }),
      {}
    );
  });

  test('emits event on opponent selection', async () => {
    const app = render(<App />);
    await Engine.getExistingGame;
    app.rerender(<App />);
    useHiveDispatcher().dispatch(tileSelectEvent);
    expect(gameConnection.sendSelection).toHaveBeenLastCalledWith('select', tileSelectEvent.tile);
  });

  test('emits event on opponent deselect', async () => {
    const app = render(<App />);
    await Engine.getExistingGame;
    app.rerender(<App />);
    useHiveDispatcher().dispatch(tileDeselectEvent);
    expect(gameConnection.sendSelection).toHaveBeenLastCalledWith('deselect', tileDeselectEvent.tile);
  });

  test('moveTile is called on move events', async () => {
    const app = render(<App />);
    await Engine.getNewGame();
    app.rerender(<App />);
    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(Engine.moveTile).toHaveBeenCalledTimes(1);
  });

  test('game is updated after move', async () => {
    const app = render(<App />);
    await Engine.getNewGame();
    app.rerender(<App />);

    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(GameArea).toHaveBeenCalledTimes(2);
  });
});
