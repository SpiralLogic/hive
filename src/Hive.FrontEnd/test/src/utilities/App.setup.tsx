import { GameState } from '@hive/domain';
import { createGameState } from '../../fixtures/app.fixture.ts';
import { HiveDispatcher } from '@hive/services';
import { render } from '@testing-library/preact';
import { Dispatcher } from '@hive/hooks/useHiveDispatchListener.tsx';
import App from '@hive/components/App.tsx';

const createEngine = (gameState = Promise.resolve(createGameState(4)), gameAfterMove = createGameState(5)) =>
  ({
    aiMode: 'off',
    initialGame: gameState,
    currentPlayer: 0,
    move: vi.fn().mockResolvedValueOnce(createGameState(5)).mockResolvedValue(gameAfterMove),
  }) as const;

export const appSetup = (gameState?: Promise<GameState>, gameAfterMove?: GameState) => {
  const closeConnection = vi.fn().mockResolvedValue(undefined);
  const defaultConnectionFactory = vi.fn(() => ({
    connectGame: vi.fn(),
    getConnectionState: vi.fn(),
    closeConnection,
    sendSelection: vi.fn(),
  }));
  const engine = createEngine(
    gameState ?? Promise.resolve(createGameState(4)),
    gameAfterMove ?? createGameState(5)
  );
  const dispatcher = new HiveDispatcher();
  return {
    ...render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    ),
    dispatcher,
    engine,
    closeConnection,
  };
};
