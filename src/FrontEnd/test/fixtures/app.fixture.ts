import { Cell, GameState } from '../../src/domain';
import { MoveEvent } from '../../src/services';

export const cellMoveEvent: MoveEvent = {
  move: { coords: { q: 1, r: 1 }, tileId: 1 },
  type: 'move',
};
export const createGameState = (cells: number): GameState => {
  const createCells = (number: number) => {
    const cellArray = new Array(number).fill(null);
    return cellArray.map((_, i) => ({
      coords: { q: i, r: 0 },
      tiles: [{ id: 2, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
    }));
  };

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
