import '../css/app.css';
import { FunctionComponent, h } from 'preact';
import { GameState } from '../domain';
import { HexEngine } from '../domain/engine';
import {
  attachServerHandlers,
  opponentConnectedHandler,
  opponentSelectionHandler,
} from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import GameArea from './GameArea';
import ServerConnection from '../services/server-connection';

const App: FunctionComponent<{ engine: HexEngine }> = (props) => {
  const { engine } = props;
  const [gameState, updateGameState] = useState<GameState | undefined>(undefined);
  const [fetchStatus, setFetchStatus] = useState('loading !');

  useEffect(() => {
    engine.initialGame
      .then((gameState) => {
        window.history.replaceState(
          { playerId: engine.playerId, gameId: gameState.gameId },
          document.title,
          `/game/${gameState.gameId}/${engine.playerId}${document.location.search}`
        );
        updateGameState(gameState);
      })
      .catch((e) => setFetchStatus(e));
  }, []);

  useEffect(() => {
    if (!gameState) return;
    const serverConnection = new ServerConnection(
      engine.playerId,
      gameState.gameId,
      updateGameState,
      opponentSelectionHandler,
      opponentConnectedHandler
    );
    serverConnection.connectGame().then();

    const removeServerHandlers = attachServerHandlers(
      serverConnection.sendSelection,
      gameState,
      updateGameState,
      engine.move
    );

    return () => {
      removeServerHandlers();
      serverConnection.closeConnection().then();
    };
  }, [gameState?.gameId]);

  if (gameState === undefined) return <h1>{fetchStatus}</h1>;

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
