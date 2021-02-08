import { Cell, GameState, MoveTile, Player, PlayerId } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HiveEvent, HiveEventListener, useHiveEventEmitter } from '../emitters';
import { useEffect, useState } from 'preact/hooks';
import Engine from '../game-engine';
import GameArea from './GameArea';

const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  parents.flatMap((p) => p.flatMap((p) => p.tiles)).filter((t) => t.playerId !== playerId);

const App: FunctionComponent = () => {
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [playerId, setPlayerId] = useState<PlayerId>(0);
  const hiveEventEmitter = useHiveEventEmitter();

  const moveTile: MoveTile = async (...move) => {
    const newGameState = await Engine.moveTile(...move);
    setGameState(newGameState);
  };

  useEffect(() => {
    const [, route, gameId, routePlayerId] = window.location.pathname.split('/');
    const loadExistingGame = gameId && route === 'game';
    const getInitial = loadExistingGame ? Engine.getGame : Engine.newGame;

    getInitial(gameId).then((gameState) => {
      const { gameId } = gameState;
      setGameState(gameState);
      const [player] = gameState.players;
      const playerId = (Number(routePlayerId) as PlayerId) ? Number(routePlayerId) : player.id;
      setPlayerId(playerId);
      window.history.replaceState(
        { playerId, gameId },
        document.title,
        `/game/${gameId}/${playerId}`
      );
    });
  }, []);

  useEffect(() => {
    if (gameState === undefined) return;
    const { closeConnection } = Engine.connectGame(gameState.gameId, setGameState);
    const hiveEventListener: HiveEventListener<HiveEvent> = (event: HiveEvent) =>
      event.type === 'move' && moveTile(gameState.gameId, event.move);
    hiveEventEmitter.add(hiveEventListener);
    const c = document.querySelector('.hex-container');
    const h = document.querySelector('.hextille');
    if (c && h)
      c.scrollTo((c.scrollWidth - c.clientWidth) / 2, (c.scrollHeight - c.clientHeight) / 2);

    return async () => {
      hiveEventEmitter.remove(hiveEventListener);
      await closeConnection();
    };
  }, [gameState === undefined]);

  if (gameState === undefined) return <h1>loading !</h1>;

  getAllPlayerTiles(playerId, gameState.players, gameState.cells).forEach((t) =>
    t.moves.splice(0, t.moves.length)
  );

  return <GameArea gameState={gameState} />;
};

App.displayName = 'App';
export default App;
