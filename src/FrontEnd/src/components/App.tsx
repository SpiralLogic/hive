import '../css/app.css';
import { Fragment, FunctionComponent, h } from 'preact';
import { GameState, PlayerId } from '../domain';
import { HexEngine } from '../domain/engine';
import ServerConnection from '../services/server-connection';
import {
  attachServerHandlers,
  opponentConnectedHandler,
  opponentSelectionHandler,
} from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import GameArea from './GameArea';

const App: FunctionComponent<{ engine: HexEngine }> = (props) => {
  const { engine } = props;
  const [gameState, updateGameState] = useState<GameState | undefined>(undefined);
  const [fetchStatus, setFetchStatus] = useState(<h1>loading !</h1>);
  const [playerId, setPlayerId] = useState<PlayerId>(0);
  const aiState = useState(true);

  useEffect(() => {
    const [, route, gameId, routePlayerId] = window.location.pathname.split('/');
    const loadExistingGame = gameId && routePlayerId && route === 'game';
    const getInitial = loadExistingGame ? engine.getExistingGame : engine.getNewGame;
    const currentPlayerId = Number(routePlayerId) || 0;
    setPlayerId(currentPlayerId);

    getInitial(gameId)
      .then((gameState) => {
        window.history.replaceState(
          { currentPlayerId, gameId },
          document.title,
          `/game/${gameState.gameId}/${currentPlayerId}${document.location.search}`
        );
        updateGameState(gameState);
      })
      .catch((e) => setFetchStatus(<h1>{e}</h1>));
  }, []);

  useEffect(() => {
    if (!gameState) return;
    const serverConnection = new ServerConnection(
      playerId,
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
      (move) => engine.moveTile(gameState.gameId, move, aiState[0])
    );

    return () => {
      removeServerHandlers();
      serverConnection.closeConnection().then();
    };
  }, [gameState?.gameId, aiState[0]]);

  if (gameState === undefined) return fetchStatus;

  return (
    <GameArea
      players={gameState.players}
      cells={gameState.cells}
      gameStatus={gameState.gameStatus}
      playerId={playerId}
      aiState={aiState}
    />
  );
};

App.displayName = 'App';
export default App;
