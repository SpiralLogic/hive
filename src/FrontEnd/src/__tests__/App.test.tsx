import { GameState } from '../domain';
import { cellMoveEvent, createGameState } from './fixtures/app.fixture';
import { h } from 'preact';
import { mockExecCommand } from './helpers/clipboard';
import { render, screen } from '@testing-library/preact';
import { useHiveDispatcher } from '../utilities/hooks';
import App from '../components/App';
import GameEngine from '../services/game-engine';
import userEvent from '@testing-library/user-event';

jest.mock('../services/server-connection', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connectGame: jest.fn().mockResolvedValue(undefined),
      getConnectionState: jest.fn(),
      closeConnection: jest.fn().mockResolvedValue(undefined),
      sendSelection: jest.fn().mockResolvedValue(undefined),
    };
  });
});

describe('App Tests', () => {
  const engine = new GameEngine();
  let gameState: GameState;
  beforeEach(() => {
    global.window.history.replaceState({}, global.document.title, `/`);
    gameState = createGameState(1);
    const gameAfterMove = createGameState(2);
    engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
    engine.getNewGame = jest.fn().mockResolvedValue(gameState);
    engine.getExistingGame = jest.fn().mockResolvedValue(gameState);
  });

  test('shows loading', () => {
    render(<App engine={engine} />);
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  test('shows game when loaded', async () => {
    render(<App engine={engine} />);
    await engine.getNewGame();
    expect(screen.getByTitle('Hive Game Area')).toBeInTheDocument();
  });

  test('can load existing game', async () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const app = render(<App engine={engine} />);
    await engine.getExistingGame;
    app.rerender(<App engine={engine} />);
    expect(engine.getExistingGame).toHaveBeenCalled();
  });

  test('updates game after move', async () => {
    const app = render(<App engine={engine} />);
    await engine.getExistingGame;

    app.rerender(<App engine={engine} />);
    expect(app).toMatchSnapshot();
  });

  test('moveTile is called on move events', async () => {
    const app = render(<App engine={engine} />);
    await engine.getNewGame();
    app.rerender(<App engine={engine} />);
    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(engine.moveTile).toHaveBeenCalledTimes(1);
  });

  test('show rules is rendered', async () => {
    const app = render(<App engine={engine} />);
    await engine.getNewGame();
    app.rerender(<App engine={engine} />);
    userEvent.click(screen.getByTitle(/Rules/));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('show share dialog is shown', async () => {
    mockExecCommand();
    const app = render(<App engine={engine} />);
    await engine.getNewGame();
    app.rerender(<App engine={engine} />);
    userEvent.click(screen.getByTitle(/Share/));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
