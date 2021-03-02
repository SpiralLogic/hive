import { Cell, GameId, GameState, Player, PlayerId, Tile } from '../domain';
import { FunctionComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import GameArea from './GameArea';
import Engine from '../utilities/game-engine';
import { addHiveEventListener, useHiveEventEmitter } from '../utilities/hooks';
import { MoveEvent, TileEvent } from '../utilities/hive-event-emitter';

const App: FunctionComponent = () => {
  const [gameState, updateGameState] = useState<GameState | undefined>(undefined);
  const [playerId, setPlayerId] = useState<PlayerId>(0);

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
    const getInitial = loadExistingGame ? Engine.getGame : Engine.newGame;
    initializeGame(getInitial, gameId, routePlayerId).then();
  }, []);

  if (gameState === undefined) return <h1>loading !</h1>;
  const hiveEventEmitter = useHiveEventEmitter();
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
        sendSelection('select', event.tile.id);
      }
    };

    const deselectionChangeHandler = (event: TileEvent) => {
      if (sendSelection) {
        sendSelection('deselect', event.tile.id);
      }
    };

    hiveEventEmitter.add<TileEvent>('tileSelected', selectionChangeHandler);
    hiveEventEmitter.add<TileEvent>('tileDeselected', deselectionChangeHandler);

    return () => {
      closeConnection();
      hiveEventEmitter.remove<TileEvent>('tileSelected', selectionChangeHandler);
      hiveEventEmitter.remove<TileEvent>('tileDeselected', deselectionChangeHandler);
    };
  }, []);

  return <GameArea players={gameState.players} cells={gameState.cells} playerId={playerId} />;
};

App.displayName = 'App';
export default App;
