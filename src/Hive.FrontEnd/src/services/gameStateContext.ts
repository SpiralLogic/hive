import { Cells,  GameState, GameStatus, HexCoordinates, Player, Players, TileMapKey } from '../domain';
import { batch, signal } from '@preact/signals';
import { HistoricalMoves } from '../domain/historical-move';
import { useContext } from 'preact/hooks';
import { createContext } from 'preact';

type NonEmptyArray<T> = [T, ...T[]];

function isNonEmpty<A>(arr: Array<A>): arr is NonEmptyArray<A> {
  return arr.length > 0;
}
export const moveMap = signal(new Map<TileMapKey, HexCoordinates>());

const updateMoveMap = (players: Player[], cells: Cells) => {
  const newMoveMap = new Map<TileMapKey, HexCoordinates>();
  players
    .flatMap((p) => p.tiles)
    .forEach((t) => {
      newMoveMap.set(`${t.playerId}-${t.id}`, t.moves);
    });

  cells
    .flatMap((c) => c.tiles)
    .filter((t) => isNonEmpty(t.moves))
    .forEach((t) => newMoveMap.set(`${t.playerId}-${t.id}`, t.moves));
  moveMap.value = newMoveMap;
};

const createGameState = () => {
  const cells = signal<Cells>([]);
  const players = signal<Players>([]);
  const history = signal<HistoricalMoves>([]);
  const gameStatus = signal<GameStatus>('NewGame');
  const gameId = signal<string>('');
  const setGameState = (gameState: GameState) => {
    if (gameState.history.length === 0 || gameState.history.length > history.peek().length) {
      updateMoveMap(gameState.players, gameState.cells);
      batch(() => {
        cells.value = gameState.cells;
        if (
          gameState.players.some(
            (p) => p.tiles.length !== players.peek().find((p2) => p.id === p2.id)?.tiles.length
          )
        )
          players.value = gameState.players;
        history.value = gameState.history;
        gameStatus.value = gameState.gameStatus;
        gameId.value = gameState.gameId;
      });
    }
  };

  return { cells, players, history, gameStatus, gameId, setGameState };
};
export const GameStateContext = createContext(createGameState());
export const useGameState = () => useContext(GameStateContext);
