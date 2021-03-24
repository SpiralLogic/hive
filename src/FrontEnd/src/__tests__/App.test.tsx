import { HexEngine } from '../domain/engine';
import { RenderResult, render, screen } from '@testing-library/preact';
import { cellMoveEvent, createGameState } from './fixtures/app.fixture';
import { h } from 'preact';
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
    const engine = new GameEngine('game', '33', '1');
    const gameState = createGameState(1);
    const gameAfterMove = createGameState(2);

    global.window.history.replaceState({}, global.document.title, url);

    jest.spyOn(engine, 'move').mockResolvedValue(gameAfterMove);
    jest.spyOn(engine, 'getNewGame').mockResolvedValue(gameState);
    jest.spyOn(engine, 'getExistingGame').mockResolvedValue(gameState);
    const app = render(<App engine={engine} />);

    return [app, engine];
  };

  it('shows loading', () => {
    renderApp('/');
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('shows game when loaded', async () => {
    const [, engine] = renderApp('/');
    await engine.getNewGame();
    expect(screen.getByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('can load existing game', async () => {
    const [_, engine] = renderApp(`/game/33/1`);
    await engine.getExistingGame;
    expect(engine.getExistingGame).toHaveBeenCalledWith('33');
  });

  it('updates game after move', async () => {
    const [app, engine] = renderApp(`/game/33/1`);
    await engine.getExistingGame;

    app.rerender(<App engine={engine} />);
    expect(app).toMatchSnapshot();
  });

  it('moveTile is called on move events', async () => {
    const [app, engine] = renderApp(`/game/33/1`);
    await engine.getNewGame();
    app.rerender(<App engine={engine} />);
    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(engine.move).toHaveBeenCalledTimes(1);
  });
});
