import { Cell, GameState, Player } from '@hive/domain';
import { HistoricalMove } from '@hive/domain/historical-move';

export const createGameState = (cells: number, withHistory = false): GameState => {
  const emptyCell: Cell = { coords: { q: 0, r: 0 }, tiles: [] };
  const player0 = { id: 0, name: 'Player 1', tiles: [] };
  const player1: Player = {
    id: 1,
    name: 'Player 2',
    tiles: [{ id: 1, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
  };

  const row = Array.from({ length: cells }).fill(emptyCell) as Array<Cell>;
  row.push({
    coords: { q: 1, r: 1 },
    tiles: [{ id: 0, playerId: 0, creature: 'beetle', moves: [{ q: 0, r: 0 }] }],
  });
  const history: HistoricalMove[] = [
    { move: { tile: { id: 1, playerId: 1 }, coords: { q: 1, r: 1 } }, originalCoords: { q: 0, r: 0 } },
  ];
  const gameState: GameState = {
    gameId: '33',
    cells: row,
    players: [player0, player1],
    gameStatus: 'MoveSuccess',
    history: [],
  };

  return withHistory ? { ...gameState, history } : gameState;
};
