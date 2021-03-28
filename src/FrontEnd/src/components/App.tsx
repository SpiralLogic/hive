import '../css/app.css';
import { FunctionComponent, h } from 'preact';
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
  props
) => {
  const { engine, connectionFactory } = props;
  const [gameState, updateHandler] = useState<GameState | undefined>(undefined);
  const [fetchStatus, setFetchStatus] = useState('loading !');

  useLayoutEffect(() => {
    engine.initialGame
      .then((initialGameState) => {
        window.history.replaceState(
          { playerId: engine.playerId, gameId: initialGameState.gameId },
          document.title,
          `/game/${initialGameState.gameId}/${engine.playerId}${document.location.search}`
        );
        updateHandler(initialGameState);
      })
      .catch((e) => setFetchStatus(e));
  }, []);

  useLayoutEffect(() => {
    if (!gameState) return () => {};
    const serverConnection = connectionFactory({
      playerId: engine.playerId,
      gameId: gameState.gameId,
      updateHandler,
      opponentSelectionHandler,
      opponentConnectedHandler,
    });
    serverConnection.connectGame().catch(() => {});

    const removeServerHandlers = attachServerHandlers(
      serverConnection.sendSelection,
      gameState,
      updateHandler,
      engine.move,
      engine.playerId === 0
    );

    return (): void => {
      removeServerHandlers();
      serverConnection.closeConnection().catch(() => {});
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
      playerId={engine.playerId}
    />
  );
};

App.displayName = 'App';
export default App;
