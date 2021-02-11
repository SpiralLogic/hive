import { Cell, GameState, MoveTile, Player, PlayerId } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HiveEvent, HiveEventListener } from '../emitters';
import { useEffect, useState } from 'preact/hooks';
import { useHiveEventEmitter } from '../hooks';
import Engine from '../game-engine';
import GameArea from './GameArea';

const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  parents.flatMap((p) => p.flatMap((p) => p.tiles)).filter((t) => t.playerId !== playerId);

const App: FunctionComponent = () => {
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [playerId, setPlayerId] = useState<PlayerId>(0);

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
      window.history.replaceState({ playerId, gameId }, document.title, `/game/${gameId}/${playerId}`);
    });
  }, []);

  useEffect(() => {
    if (gameState === undefined) return;
    const { closeConnection } = Engine.connectGame(gameState.gameId, setGameState);
    return closeConnection;
  }, [gameState === undefined]);

  if (gameState === undefined) return <h1>loading !</h1>;

  const moveTile: MoveTile = async (...move) => {
    const newGameState = await Engine.moveTile(...move);
    setGameState(newGameState);
  };

  const onMove: HiveEventListener<HiveEvent> = (event: HiveEvent) => {
    event.type === 'move' && moveTile(gameState.gameId, event.move);
  };

  useHiveEventEmitter(onMove, []);

  getAllPlayerTiles(playerId, gameState.players, gameState.cells).forEach((t) =>
    t.moves.splice(0, t.moves.length)
  );

  return <GameArea gameState={gameState} />;
};

App.displayName = 'App';
export default App;
