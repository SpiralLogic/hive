import { render, screen } from '@testing-library/preact';
import { AiMode, HexEngine } from '../../src/domain/engine';
import App from '../../src/components/App';
import { createGameState } from '../fixtures/app.fixture';
import { HiveDispatcher } from '../../src/services';
import { Dispatcher } from '../../src/hooks/useHiveDispatchListener';
import { signal } from '@preact/signals';

const closeConnectionMock = vi.fn();
const defaultConnectionFactory = () => ({
  connectGame: vi.fn(),
  getConnectionState: vi.fn(),
  closeConnection: closeConnectionMock,
  sendSelection: vi.fn(),
});

describe('<App>', () => {
  const gameState = createGameState(4);
  const gameAfterMove = createGameState(5);
  const aiMode = signal<AiMode>('off');
  const engine: HexEngine = {
    getAiMode: () => aiMode,
    initialGame: Promise.resolve(gameState),
    currentPlayer: 0,
    move: vi.fn().mockResolvedValue({ ...gameAfterMove, gameId: 'ddd' }),
  };

  it('shows loading', () => {
    render(<App engine={engine} connectionFactory={defaultConnectionFactory} />);
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('shows game when loaded', async () => {
    render(<App engine={engine} connectionFactory={defaultConnectionFactory} />);
    await engine.initialGame;
    expect(await screen.findByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('cleanup', async () => {
    const dispatcher = new HiveDispatcher();
    vi.spyOn(dispatcher, 'remove');
    const { unmount, rerender } = render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );
    await engine.initialGame;
    rerender(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );
    unmount();
    expect(dispatcher.remove).toBeCalled();
  });
});
