import { MoveEvent } from '../../services';

export const cellMoveEvent: MoveEvent = {
  move: { coords: { q: 1, r: 1 }, tileId: 1 },
  type: 'move',
};
export const createGameState = (cells: number) => {
  const emptyCell = { coords: { q: 0, r: 0 }, tiles: [] };
  const player = { id: 2, name: 'Player 1', tiles: [] };
  const player2 = {
    id: 1,
    name: 'Player 2',
    tiles: [{ id: 1, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
  };
  return { gameId: '33', cells: new Array(cells).fill(emptyCell), players: [player, player2] };
};
