import '../css/app.css';

import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { GameState } from '../domain';
import { HexEngine, HexServerConnectionFactory } from '../domain/engine';
import { addServerHandlers, opponentConnectedHandler, opponentSelectionHandler } from '../utilities/handlers';
import GameArea from './GameArea';
import { getHiveDispatcher } from '../utilities/dispatcher';

const App: FunctionComponent<{ engine: HexEngine; connectionFactory: HexServerConnectionFactory }> = (
  properties
) => {
  const { engine, connectionFactory } = properties;
  const [gameState, updateHandler] = useState<GameState | undefined>();
  const [fetchStatus, setFetchStatus] = useState('loading !');
  const hiveDispatcher = getHiveDispatcher();

  useEffect(() => {
    engine.initialGame
      .then((initialGameState) => {
        window.history.replaceState(
          { currentPlayer: engine.currentPlayer, gameId: initialGameState.gameId },
          document.title,
          `/game/${initialGameState.gameId}/${engine.currentPlayer}${document.location.search}`
        );
        updateHandler(initialGameState);
      })
      .catch((error: Error) => setFetchStatus(error.message));
  }, [engine.currentPlayer, engine.initialGame, hiveDispatcher]);

  useEffect(() => {
    if (!gameState?.gameId)
      return () => {
        /* no clean up */
      };
    const serverConnection = connectionFactory({
      currentPlayer: engine.currentPlayer,
      gameId: gameState.gameId,
      updateHandler,
      opponentSelectionHandler,
      opponentConnectedHandler,
    });
    serverConnection.connectGame().catch(() => {
      /* needs to be handled */
    });

    const removeServerHandlers = addServerHandlers(
      serverConnection.sendSelection,
      gameState.gameId,
      updateHandler,
      engine.move,
      engine.currentPlayer === 0
    );

    return (): void => {
      removeServerHandlers();
      serverConnection.closeConnection().catch(() => {
        /* needs to be handled */
      });
    };
  }, [gameState?.gameId, connectionFactory, engine.currentPlayer, engine.move]);

  if (gameState === undefined)
    return (
      <h1 class="loading">
        {fetchStatus}
        <br />
        (or broken)
      </h1>
    );

  return (
    <GameArea
      players={gameState.players}
      cells={gameState.cells}
      gameStatus={gameState.gameStatus}
      currentPlayer={engine.currentPlayer}
    />
  );
};

App.displayName = 'App';
export default App;
