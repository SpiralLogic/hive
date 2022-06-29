import { render, screen } from '@testing-library/preact';
import { ComponentChild } from 'preact';
import { HexEngine, HexServerConnectionFactory } from '../../src/domain/engine';
import App from '../../src/components/App';
import { createGameState } from '../fixtures/app.fixture';
const defaultConnectionFactory: HexServerConnectionFactory = () => ({
  connectGame: jest.fn(),
  getConnectionState: jest.fn(),
  closeConnection: () => Promise.resolve(),
  sendSelection: () => Promise.resolve(),
});

describe('<App>', () => {
  const renderApp = (
    url: string,
    connectionFactory?: HexServerConnectionFactory
  ): [(ui: ComponentChild) => void, HexEngine] => {
    const gameState = createGameState(4);
    const gameAfterMove = createGameState(5);
    const engine: HexEngine = {
      aiMode: 'on',
      initialGame: Promise.resolve(gameState),
      currentPlayer: 0,
      move: jest.fn().mockResolvedValue(gameAfterMove),
    };

    window.history.replaceState({}, global.document.title, url);

    const { rerender } = render(
      <App engine={engine} connectionFactory={connectionFactory ?? defaultConnectionFactory} />
    );

    return [rerender, engine];
  };

  it('shows loading', () => {
    renderApp('/');
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('shows game when loaded', async () => {
    const [rerender, engine] = renderApp('/');
    await engine.initialGame;
    rerender(<App engine={engine} connectionFactory={defaultConnectionFactory} />);
    expect(screen.getByTitle('Hive Game Area')).toBeInTheDocument();
  });
});
