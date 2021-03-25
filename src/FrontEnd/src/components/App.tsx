import '../css/app.css';
import { FunctionComponent, h } from 'preact';
import { GameState } from '../domain';
import { HexEngine, HexServerConnectionFactory } from '../domain/engine';
import {
  attachServerHandlers,
  opponentConnectedHandler,
  opponentSelectionHandler,
} from '../utilities/handlers';
import { useEffect, useLayoutEffect, useState } from 'preact/hooks';
import GameArea from './GameArea';

const App: FunctionComponent<{ engine: HexEngine; connectionFactory: HexServerConnectionFactory }> = (
  props
) => {
  const { engine, connectionFactory } = props;
  const [gameState, updateHandler] = useState<GameState | undefined>(undefined);
  const [fetchStatus, setFetchStatus] = useState('loading !');

  useLayoutEffect(() => {
    engine.initialGame
      .then((gameState) => {
        window.history.replaceState(
          { playerId: engine.playerId, gameId: gameState.gameId },
          document.title,
          `/game/${gameState.gameId}/${engine.playerId}${document.location.search}`
        );
        updateHandler(gameState);
      })
      .catch((e) => setFetchStatus(e));
  }, []);

  useLayoutEffect(() => {
    if (!gameState) return;
    const serverConnection = connectionFactory({
      playerId: engine.playerId,
      gameId: gameState.gameId,
      updateHandler,
      opponentSelectionHandler,
      opponentConnectedHandler,
    });
    serverConnection.connectGame().then();

    const removeServerHandlers = attachServerHandlers(
      serverConnection.sendSelection,
      gameState,
      updateHandler,
      engine.move
    );

    return () => {
      removeServerHandlers();
      serverConnection.closeConnection().then();
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
