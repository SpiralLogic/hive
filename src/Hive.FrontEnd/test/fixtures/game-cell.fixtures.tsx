import { HiveDispatcher, MoveEvent } from '../../src/services';

export const createCellWithNoTile = () => ({
  cell: { coords: { q: 0, r: 0 }, tiles: [] },
});

export const createCellWithTile = () => {
  const tile = { id: 2, playerId: 1, creature: 'fly', moves: [] };
  return { cell: { coords: { q: 1, r: 1 }, tiles: [tile] } };
};

export const createCellWithTileAndHistoricalMove = () => {
  const tile = { id: 2, playerId: 1, creature: 'fly', moves: [] };
  return { cell: { coords: { q: 1, r: 1 }, tiles: [tile] }, historical: true };
};

export const movingTile = {
  id: 2,
  moves: [
    { q: 0, r: 0 },
    { q: 2, r: 2 },
    { q: 1, r: 1 },
  ],
  creature: 'tilecanmove',
  playerId: 1,
};
export const createCellMovableTile = () => {
  return { cell: { coords: { q: 1, r: 1 }, tiles: [movingTile] } };
};

export const createCellWithTileAndDrop = () => {
  const tile = { id: 2, playerId: 1, creature: 'ant', moves: [{ r: 0, q: 0 }] };
  return { cell: { coords: { q: 2, r: 2 }, tiles: [tile] } };
};

export const createCellNoDrop = () => ({ cell: { coords: { q: 6, r: 6 }, tiles: [] } });

export const createCellCanDrop = createCellWithNoTile;
export const createCellWithTileNoDrop = createCellWithTile;

export const createMoveListener = (dispatcher: HiveDispatcher) => {
  const moveEvents: Array<MoveEvent> = [];
  const moveListener = (event: MoveEvent) => moveEvents.push(event);
  dispatcher.add<MoveEvent>('move', moveListener);
  return moveEvents;
};
