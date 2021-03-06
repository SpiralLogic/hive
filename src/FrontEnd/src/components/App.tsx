import { Fragment, FunctionComponent, h } from 'preact';
import { GameState, PlayerId } from '../domain';
import { MoveEvent, TileEvent } from '../utilities/hive-dispatcher';
import { opponentSelectionHandler } from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import { useHiveDispatcher } from '../utilities/hooks';
import Engine from '../utilities/game-engine';
import GameArea from './GameArea';
import Links from './Links';
import Rules from './Rules';
import Share from './Share';

const App: FunctionComponent = () => {
  const [gameState, updateGameState] = useState<GameState | undefined>(undefined);
  const [playerId, setPlayerId] = useState<PlayerId>(0);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState(<h1>loading !</h1>);

  useEffect(() => {
    const [, route, gameId, routePlayerId] = window.location.pathname.split('/');
    const loadExistingGame = gameId && routePlayerId && route === 'game';
    const getInitial = loadExistingGame ? Engine.getExistingGame : Engine.getNewGame;
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
    const { closeConnection, sendSelection } = Engine.connectGame(gameState.gameId, {
      updateGameState,
      opponentSelection: opponentSelectionHandler,
    });
    const hiveDispatcher = useHiveDispatcher();

    const selectionChangeHandler = (event: TileEvent) => sendSelection('select', event.tile);
    const deselectionChangeHandler = (event: TileEvent) => sendSelection('deselect', event.tile);
    const moveHandler = (event: MoveEvent) =>
      Engine.moveTile(gameState.gameId, event.move).then(updateGameState);

    hiveDispatcher.add<MoveEvent>('move', moveHandler);
    hiveDispatcher.add<TileEvent>('tileSelected', selectionChangeHandler);
    hiveDispatcher.add<TileEvent>('tileDeselected', deselectionChangeHandler);

    return () => {
      hiveDispatcher.remove<MoveEvent>('move', moveHandler);
      hiveDispatcher.remove<TileEvent>('tileSelected', selectionChangeHandler);
      hiveDispatcher.remove<TileEvent>('tileDeselected', deselectionChangeHandler);
      closeConnection().then();
    };
  }, [gameState?.gameId]);

  return gameState === undefined ? (
    fetchStatus
  ) : (
    <>
      <GameArea players={gameState.players} cells={gameState.cells} playerId={playerId} />
      <Links onShowRules={() => setShowRules(true)} onShowShare={() => setShowShare(true)} />
      {showRules ? <Rules setShowRules={setShowRules} /> : ''}
      {showShare ? <Share setShowShare={setShowShare} /> : ''}
    </>
  );
};

App.displayName = 'App';
export default App;
