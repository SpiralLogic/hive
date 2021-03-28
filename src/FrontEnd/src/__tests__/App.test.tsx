import { RenderResult, render, screen } from '@testing-library/preact';
import { h } from 'preact';
import { HexEngine, HexServerConnectionFactory } from '../domain/engine';
import { useHiveDispatcher } from '../utilities/dispatcher';
import App from '../components/App';
import { cellMoveEvent, createGameState } from './fixtures/app.fixture';

describe('app tests', () => {
  const connectionFactory: HexServerConnectionFactory = (config) => ({
    connectGame: jest.fn().mockResolvedValue(undefined),
    getConnectionState: jest.fn(),
    closeConnection: jest.fn().mockResolvedValue(undefined),
    sendSelection: jest.fn().mockResolvedValue(undefined),
  });

  const renderApp = (url: string): [RenderResult, HexEngine] => {
    const gameState = createGameState(1);
    const gameAfterMove = createGameState(2);
    const engine: HexEngine = {
      initialGame: Promise.resolve(gameState),
      playerId: 0,
      move: jest.fn().mockResolvedValue(gameAfterMove),
      getNewGame: jest.fn().mockResolvedValue(gameState),
      getExistingGame: jest.fn().mockResolvedValue(gameState),
    };

    global.window.history.replaceState({}, global.document.title, url);

    const app = render(<App engine={engine} connectionFactory={connectionFactory} />);

    return [app, engine];
  };

  it('shows loading', () => {
    renderApp('/');
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('shows game when loaded', async () => {
    const [app, engine] = renderApp('/');
    await engine.initialGame;
    app.rerender(<App engine={engine} connectionFactory={connectionFactory} />);
    expect(screen.getByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('moveTile is called on move events', async () => {
    const [app, engine] = renderApp(`/game/33/1`);
    await engine.getNewGame();
    app.rerender(<App engine={engine} connectionFactory={connectionFactory} />);
    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(engine.move).toHaveBeenCalledTimes(1);
  });
});
