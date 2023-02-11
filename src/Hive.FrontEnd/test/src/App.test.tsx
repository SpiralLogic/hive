import { render, screen } from '@testing-library/preact';
import { AiMode, HexEngine } from '../../src/domain/engine';
import App from '../../src/components/App';
import { createGameState } from '../fixtures/app.fixture';
import { HiveDispatcher } from '../../src/services';
import { dispatcher, Dispatcher } from '../../src/hooks/useHiveDispatchListener';
import { signal } from '@preact/signals';

const closeConnectionMock = vi.fn();
const defaultConnectionFactory = () => ({
  connectGame: vi.fn(),
  getConnectionState: vi.fn(),
  closeConnection: closeConnectionMock,
  sendSelection: vi.fn(),
});
let engine: HexEngine;
const setup = (gameState = createGameState(4), gameAfterMove = createGameState(5)) => {
  const aiMode = signal<AiMode>('off');
  engine = {
    getAiMode: () => aiMode,
    initialGame: Promise.resolve(gameState),
    currentPlayer: 0,
    move: vi
      .fn()
      .mockReset()
      .mockResolvedValue({ ...gameAfterMove, gameId: 'ddd' }),
  };
  const dispatcher = new HiveDispatcher();
  return {
    ...render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    ),
    dispatcher,
  };
};
describe('<App>', () => {
  it('shows loading', () => {
    setup();
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('loads initial board', async () => {
    setup();
    await engine.initialGame;
    dispatcher.dispatch({ type: 'move', move: { tileId: 1, coords: { q: 0, r: 0 } } });
    expect(await screen.findByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('shows game when loaded', async () => {
    setup();
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
