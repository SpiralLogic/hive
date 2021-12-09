import { Cell, GameState } from '../../src/domain';

export const createGameState = (cells: number): GameState => {
  const emptyCell: Cell = { coords: { q: 0, r: 0 }, tiles: [] };
  const player0 = { id: 0, name: 'Player 0', tiles: [] };
  const player1 = {
    id: 1,
    name: 'Player 2',
    tiles: [{ id: 1, playerId: 1, creature: 'player1', moves: [{ q: 0, r: 0 }] }],
  };
  const row = Array.from({ length: cells }).fill(emptyCell) as Array<Cell>;
  row.push({
    coords: { q: 1, r: 1 },
    tiles: [{ id: 0, playerId: 0, creature: 'player0', moves: [{ q: 0, r: 0 }] }],
  });
  return { gameId: '33', cells: row, players: [player0, player1], gameStatus: 'MoveSuccess' };
};
