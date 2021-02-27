import { Cell, GameId, GameState, MoveTile, Player, PlayerId, Tile, TileId } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HiveEvent, HiveEventListener } from '../hive-event-emitter';
import { OpponentSelectionHandler } from '../domain/engine';
import { useEffect, useState } from 'preact/hooks';
import { useHiveEventEmitter } from '../hooks';
import Engine from '../game-engine';
import GameArea from './GameArea';

const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((p) => p.flatMap((p) => p.tiles));

const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId !== playerId && playerId !== 2);

const removeOtherPlayerMoves = (playerId: number, gameState: GameState) => {
  getAllPlayerTiles(playerId, gameState.players, gameState.cells).forEach((t) =>
    t.moves.splice(0, t.moves.length)
  );
};

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

  const hiveEventHandler: HiveEventListener<HiveEvent> = async (event: HiveEvent) => {
    if (event.type === 'move') {
      const newGameState = await Engine.moveTile(gameState.gameId, event.move);
      updateGameState(newGameState);
    }
  };

  const hiveEventEmitter = useHiveEventEmitter(hiveEventHandler, []);

  const opponentSelectionHandler: OpponentSelectionHandler = (type, tileId) => {
    const hiveEventEmitter = useHiveEventEmitter();
    const tile = getAllTiles(gameState.players, gameState.cells).find((t) => t.id === tileId);
    if (!tile || tile.playerId === playerId) return;
    if (type === 'select') {
      hiveEventEmitter.emit({ type: 'tileSelect', tile });
    } else if (type === 'deselect') {
      hiveEventEmitter.emit({ type: 'tileDeselect', tile });
    }
  };

  useEffect(() => {
    const { closeConnection, sendSelection } = Engine.connectGame(gameState.gameId, {
      updateGameState,
      opponentSelection: opponentSelectionHandler,
    });

    const selectionChangeHandler = (event: HiveEvent) => {
      if (event.type == 'tileSelect' && sendSelection) {
        sendSelection('select', event.tile.id);
      } else if (event.type == 'tileDeselect' && sendSelection) {
        sendSelection('deselect', event.tile.id);
      }
    };
    hiveEventEmitter.add(selectionChangeHandler);

    return () => closeConnection() && hiveEventEmitter.remove(selectionChangeHandler);
  }, []);

  removeOtherPlayerMoves(playerId, gameState);

  return <GameArea gameState={gameState} />;
};

App.displayName = 'App';
export default App;
