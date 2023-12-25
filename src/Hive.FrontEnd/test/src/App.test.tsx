import { render, screen } from '@testing-library/preact';
import { HexEngine } from '@hive/domain/engine';
import App from '../../src/components/App';
import { createGameState } from '../fixtures/app.fixture';
import { HiveDispatcher } from '@hive/services';
import { Dispatcher } from '@hive/hooks/useHiveDispatchListener';
import { waitFor } from '@testing-library/dom';
import { GameState } from '@hive/domain';
import { mockConsole } from '../helpers/console';

const closeConnectionMock = vi.fn();
const defaultConnectionFactory = () => ({
  connectGame: vi.fn(),
  getConnectionState: vi.fn(),
  closeConnection: closeConnectionMock.mockResolvedValueOnce(undefined),
  sendSelection: vi.fn(),
});

let engine: HexEngine;
const setup = (gameState = Promise.resolve(createGameState(4)), gameAfterMove = createGameState(5)) => {
  engine = {
    aiMode: 'off',
    initialGame: gameState,
    currentPlayer: 0,
    move: vi.fn().mockResolvedValueOnce(createGameState(5)).mockResolvedValue(gameAfterMove),
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
  it('shows game when loaded', async () => {
    setup(Promise.reject({ message: 'broken loading' }));
    expect(await screen.findByRole('heading', { name: /broken loading/ })).toBeInTheDocument();
  });

  it('shows loading', () => {
    setup();
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it('loads initial board', async () => {
    const gameState = createGameState(4);
    const gameStateAfterMove = {
      ...gameState,
      history: [
        ...gameState.history,
        {
          move: {
            tile: {
              id: 4,
              playerId: 0,
            },
            coords: {
              q: -1,
              r: -4,
            },
          },
          aiMove: false,
        },
      ],
      players: [
        {
          ...gameState.players[0],
          tiles: [
            {
              id: 4,
              playerId: 0,
              creature: 'rabbit',
              moves: [],
            },
          ],
        },
        gameState.players[1],
      ],
    } as GameState;
    const { dispatcher } = setup(Promise.resolve(gameState), gameStateAfterMove);
    await engine.initialGame;
    dispatcher.dispatch({ type: 'move', move: { tileId: 1, coords: { q: 0, r: 0 } } });
    dispatcher.dispatch({ type: 'move', move: { tileId: 1, coords: { q: 0, r: 0 } } });
    expect(await screen.findByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('sets error message on loading error', async () => {
    const dispatcher = new HiveDispatcher();
    vi.spyOn(dispatcher, 'remove');
    const { unmount } = render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );

    unmount();
    expect(dispatcher.remove).toBeCalled();
  });

  it('cleans up event handlers', async () => {
    const dispatcher = new HiveDispatcher();
    vi.spyOn(dispatcher, 'remove');
    const { unmount } = render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );

    unmount();
    expect(dispatcher.remove).toBeCalled();
  });

  it('calls close connection when App is unmounted', async () => {
    const restoreConsole = mockConsole();
    const dispatcher = new HiveDispatcher();
    closeConnectionMock.mockReset().mockRejectedValueOnce('test');
    const { unmount } = render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );

    unmount();
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('test');
    });
    restoreConsole();
  });
});
