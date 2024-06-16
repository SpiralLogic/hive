import { HiveDispatcher, MoveEvent } from '@hive/services';
import { Tile } from '@hive/domain';

export const createCellWithNoTile = () => ({
  cell: { coords: { q: 0, r: 0 }, tiles: [] },
});

export const createCellWithTile = () => {
  const tile: Tile = { id: 2, playerId: 1, creature: 'queen', moves: [] };
  return { cell: { coords: { q: 1, r: 1 }, tiles: [tile] } };
};

export const createCellWithTileAndHistoricalMove = () => {
  const tile: Tile = { id: 2, playerId: 1, creature: 'queen', moves: [] };
  return { cell: { coords: { q: 1, r: 1 }, tiles: [tile] }, historical: true };
};

export const movingTile: Tile = {
  id: 2,
  moves: [
    { q: 0, r: 0 },
    { q: 2, r: 2 },
    { q: 1, r: 1 },
  ],
  creature: 'beetle',
  playerId: 1,
};
export const createCellMovableTile = () => {
  return { cell: { coords: { q: 1, r: 1 }, tiles: [movingTile] } };
};

export const createCellWithTileAndDrop = () => {
  const tile: Tile = { id: 2, playerId: 1, creature: 'ant', moves: [{ r: 0, q: 0 }] };
  return { cell: { coords: { q: 2, r: 2 }, tiles: [tile] } };
};

export const createCellNoDrop = () => ({ cell: { coords: { q: 6, r: 6 }, tiles: [] } });

export const createCellCanDrop = createCellWithNoTile;
export const createCellWithTileNoDrop = createCellWithTile;

export const createMoveListener = (dispatcher: HiveDispatcher) => {
  const moveEvents: Array<MoveEvent> = [];
  const moveListener = (event: MoveEvent) => {
    moveEvents.push(event);
  };
  dispatcher.add("move", moveListener);
  return moveEvents;
};
