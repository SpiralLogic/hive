import { HexEngine } from '../domain/engine';
import { cellMoveEvent, createGameState } from './fixtures/app.fixture';
import { h } from 'preact';
import { render, RenderResult, screen } from '@testing-library/preact';
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

describe('app tests', () => {
  const renderApp = (url: string): [RenderResult, HexEngine] => {
    const engine = new GameEngine();
    const gameState = createGameState(1);
    const gameAfterMove = createGameState(2);

    global.window.history.replaceState({}, global.document.title, url);

    jest.spyOn(engine, 'moveTile').mockResolvedValue(gameAfterMove);
    jest.spyOn(engine, 'getNewGame').mockResolvedValue(gameState);
    jest.spyOn(engine, 'getExistingGame').mockResolvedValue(gameState);
    const app = render(<App engine={engine} />);

    return [app, engine];
  };

  test('shows loading', () => {
    renderApp('/');
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  test('shows game when loaded', async () => {
    const [, engine] = renderApp('/');
    await engine.getNewGame();
    expect(screen.getByTitle('Hive Game Area')).toBeInTheDocument();
  });

  test('can load existing game', async () => {
    const [_, engine] = renderApp(`/game/33/1`);
    await engine.getExistingGame;
    expect(engine.getExistingGame).toHaveBeenCalledWith('33');
  });

  test('updates game after move', async () => {
    const [app, engine] = renderApp(`/game/33/1`);
    await engine.getExistingGame;

    app.rerender(<App engine={engine} />);
    expect(app).toMatchSnapshot();
  });

  test('moveTile is called on move events', async () => {
    const [app, engine] = renderApp(`/game/33/1`);
    await engine.getNewGame();
    app.rerender(<App engine={engine} />);
    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(engine.moveTile).toHaveBeenCalledTimes(1);
  });
});
