import { GameState } from '../domain';
import { cellMoveEvent, createGameState } from './fixtures/app.fixture';
import { h } from 'preact';
import { mockExecCommand } from './helpers/clipboard';
import { render, screen } from '@testing-library/preact';
import { useHiveDispatcher } from '../utilities/hooks';
import App from '../components/App';
import GameEngine from '../services/game-engine';

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

describe('app Tests', () => {
  const engine = new GameEngine();
  let gameState: GameState;
  beforeEach(() => {
    global.window.history.replaceState({}, global.document.title, `/`);
    gameState = createGameState(1);
    const gameAfterMove = createGameState(2);
    jest.spyOn(engine, 'moveTile').mockImplementation().mockResolvedValue(gameAfterMove);
    jest.spyOn(engine, 'getNewGame').mockImplementation().mockResolvedValue(gameState);
    jest.spyOn(engine, 'getExistingGame').mockImplementation().mockResolvedValue(gameState);
  });

  it('shows loading', () => {
    render(<App engine={engine} />);
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('shows game when loaded', async () => {
    render(<App engine={engine} />);
    await engine.getNewGame();
    expect(screen.getByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('can load existing game', async () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const app = render(<App engine={engine} />);
    await engine.getExistingGame;
    app.rerender(<App engine={engine} />);
    expect(engine.getExistingGame).toHaveBeenCalledWith('33');
  });

  it('updates game after move', async () => {
    const app = render(<App engine={engine} />);
    await engine.getExistingGame;

    app.rerender(<App engine={engine} />);
    expect(app).toMatchSnapshot();
  });

  it('moveTile is called on move events', async () => {
    const app = render(<App engine={engine} />);
    await engine.getNewGame();
    app.rerender(<App engine={engine} />);
    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(engine.moveTile).toHaveBeenCalledTimes(1);
  });
});
