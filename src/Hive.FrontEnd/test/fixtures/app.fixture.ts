import { GameState } from '../../src/domain';
import { MoveEvent } from '../../src/services';
const createCells = (number: number) => {
  const cellArray = Array.from({ length: number });
  return cellArray.map((_, index) => ({
    coords: { q: index, r: 0 },
    tiles: [{ id: 2, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
  }));
};

export const cellMoveEvent: MoveEvent = {
  move: { coords: { q: 1, r: 1 }, tileId: 1 },
  type: 'move',
};
export const createGameState = (cells: number): GameState => {
  const player = { id: 0, name: 'Player 1', tiles: [] };
  const player2 = {
    id: 1,
    name: 'Player 2',
    tiles: [{ id: 1, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
  };
  return {
    gameId: '33',
    cells: createCells(cells),
    players: [player, player2],
    gameStatus: 'MoveSuccess',
  };
};
