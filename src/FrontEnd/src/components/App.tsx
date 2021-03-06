import { Fragment, FunctionComponent, h } from 'preact';
import { GameId, GameState, PlayerId } from '../domain';
import { MoveEvent, TileEvent } from '../utilities/hive-dispatcher';
import { addHiveEventListener, useHiveDispatcher } from '../utilities/hooks';
import { opponentSelectionHandler } from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import Engine from '../utilities/game-engine';
import GameArea from './GameArea';
import Links from './Links';
import Rules from './Rules';

const App: FunctionComponent = () => {
  const [gameState, updateGameState] = useState<GameState | undefined>(undefined);
  const [playerId, setPlayerId] = useState<PlayerId>(0);
  const [showHelp, setShowHelp] = useState<boolean>(true);

  const initializeGame = (
    getInitial: (gameId: GameId) => Promise<GameState>,
    gameId: string,
    routePlayerId: string
  ) =>
    getInitial(gameId).then((gameState) => {
      const { gameId } = gameState;
      const [player] = gameState.players;
      const playerId = (Number(routePlayerId) as PlayerId) ? Number(routePlayerId) : player.id;
      updateGameState(gameState);
      setPlayerId(playerId);
      window.history.replaceState({ playerId, gameId }, document.title, `/game/${gameId}/${playerId}`);
    });

  useEffect(() => {
    const [, route, gameId, routePlayerId] = window.location.pathname.split('/');
    const loadExistingGame = gameId && route === 'game';
    const getInitial = loadExistingGame ? Engine.getExistingGame : Engine.getNewGame;
    initializeGame(getInitial, gameId, routePlayerId).then();
  }, []);

  if (gameState === undefined) return <h1>loading !</h1>;
  const hiveDispatcher = useHiveDispatcher();

  addHiveEventListener<MoveEvent>('move', async (event) => {
    const newGameState = await Engine.moveTile(gameState.gameId, event.move);
    updateGameState(newGameState);
  });

  useEffect(() => {
    const { closeConnection, sendSelection } = Engine.connectGame(gameState.gameId, {
      updateGameState,
      opponentSelection: opponentSelectionHandler,
    });

    const selectionChangeHandler = (event: TileEvent) => {
      if (sendSelection) {
        sendSelection('select', event.tile);
      }
    };

    const deselectionChangeHandler = (event: TileEvent) => {
      if (sendSelection) {
        sendSelection('deselect', event.tile);
      }
    };

    hiveDispatcher.add<TileEvent>('tileSelected', selectionChangeHandler);
    hiveDispatcher.add<TileEvent>('tileDeselected', deselectionChangeHandler);

    return () => {
      hiveDispatcher.remove<TileEvent>('tileSelected', selectionChangeHandler);
      hiveDispatcher.remove<TileEvent>('tileDeselected', deselectionChangeHandler);
      closeConnection().then();
    };
  }, []);

  return (
    <>
      <GameArea players={gameState.players} cells={gameState.cells} playerId={playerId} />
      <Links setShowHelp={setShowHelp} />
      <Rules showHelp={showHelp} setShowHelp={setShowHelp} />
    </>
  );
};

App.displayName = 'App';
export default App;
