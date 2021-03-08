import { Fragment, FunctionComponent, h } from 'preact';
import { GameState, PlayerId } from '../domain';
import GameEngine from '../services/game-engine';
import ServerConnection from '../services/server-connection';
import { attachServerHandlers, opponentSelectionHandler } from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import GameArea from './GameArea';
import Links from './Links';
import RuleModal from './RuleModal';
import Share from './Share';

const App: FunctionComponent<{ engine: GameEngine }> = (props) => {
  const { engine } = props;
  const [gameState, updateGameState] = useState<GameState | undefined>(undefined);
  const [playerId, setPlayerId] = useState<PlayerId>(0);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState(<h1>loading !</h1>);

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
          `/game/${gameState.gameId}/${currentPlayerId}`
        );
        updateGameState(gameState);
      })
      .catch((e) => setFetchStatus(<h1>{e}</h1>));
  }, []);

  useEffect(() => {
    if (!gameState) return;
    const serverConnection = new ServerConnection(
      gameState.gameId,
      updateGameState,
      opponentSelectionHandler
    );
    serverConnection.connectGame().then();
    const removeServerHandlers = attachServerHandlers(
      serverConnection.sendSelection,
      gameState,
      updateGameState,
      engine.moveTile
    );

    return () => {
      removeServerHandlers();
      serverConnection.closeConnection().then();
    };
  }, [gameState?.gameId]);

  if (gameState === undefined) return fetchStatus;

  return (
    <>
      <GameArea players={gameState.players} cells={gameState.cells} playerId={playerId} />
      <Links onShowRules={() => setShowRules(true)} onShowShare={() => setShowShare(true)} />
      {showRules ? <RuleModal setShowRules={setShowRules} /> : ''}
      {showShare ? <Share setShowShare={setShowShare} /> : ''}
    </>
  );
};

App.displayName = 'App';
export default App;
