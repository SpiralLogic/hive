import { render, screen } from '@testing-library/preact';
import { ComponentChild } from 'preact';
import { HexEngine, HexServerConnectionFactory } from '../src/domain/engine';
import { useHiveDispatcher } from '../src/utilities/dispatcher';
import App from '../src/components/App';
import { cellMoveEvent, createGameState } from './fixtures/app.fixture';
const connectionFactory: HexServerConnectionFactory = () => ({
  connectGame: () => Promise.resolve(),
  getConnectionState: jest.fn(),
  closeConnection: () => Promise.resolve(),
  sendSelection: () => Promise.resolve(),
});
describe('app tests', () => {
  const renderApp = (url: string): [(ui: ComponentChild) => void, HexEngine] => {
    const gameState = createGameState(4);
    const gameAfterMove = createGameState(5);
    const engine: HexEngine = {
      initialGame: Promise.resolve(gameState),
      currentPlayer: 0,
      move: jest.fn().mockResolvedValue(gameAfterMove),
      getNewGame: jest.fn().mockResolvedValue(gameState),
      getExistingGame: jest.fn().mockResolvedValue(gameState),
    };

    window.history.replaceState({}, global.document.title, url);

    const { rerender } = render(<App engine={engine} connectionFactory={connectionFactory} />);

    return [rerender, engine];
  };

  it('shows loading', () => {
    renderApp('/');
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('shows game when loaded', async () => {
    const [rerender, engine] = renderApp('/');
    await engine.initialGame;
    rerender(<App engine={engine} connectionFactory={connectionFactory} />);
    expect(screen.getByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('moveTile is called on move events', async () => {
    const [rerender, engine] = renderApp(`/game/33/1`);
    await engine.getNewGame();
    rerender(<App engine={engine} connectionFactory={connectionFactory} />);
    useHiveDispatcher().dispatch(cellMoveEvent);

    expect(engine.move).toHaveBeenCalledTimes(1);
  });
});
