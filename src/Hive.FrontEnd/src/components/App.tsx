import '../css/app.css';

import {FunctionComponent, h } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';

import { GameState } from '../domain';
import { HexEngine, HexServerConnectionFactory } from '../domain/engine';
import {
  attachServerHandlers,
  opponentConnectedHandler,
  opponentSelectionHandler,
} from '../utilities/handlers';
import GameArea from './GameArea';

const App: FunctionComponent<{ engine: HexEngine; connectionFactory: HexServerConnectionFactory }> = (
  properties
) => {
  const { engine, connectionFactory } = properties;
  const [gameState, updateHandler] = useState<GameState | undefined>();
  const [fetchStatus, setFetchStatus] = useState('loading !');

  useLayoutEffect(() => {
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
  }, []);

  useLayoutEffect(() => {
    if (!gameState)
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

    const removeServerHandlers = attachServerHandlers(
      serverConnection.sendSelection,
      gameState,
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
  }, [gameState?.gameId]);

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
