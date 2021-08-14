import { act } from '@testing-library/preact';
import GameTile from '../../src/components/GameTile';
import { MoveEvent } from '../../src/services';
import { getHiveDispatcher } from '../../src/utilities/dispatcher';

export const createCellWithNoTile = () => ({ coords: { q: 0, r: 0 }, tiles: [] });

export const createCellWithTile = () => {
  const tile = { id: 2, playerId: 1, creature: 'fly', moves: [] };
  return { coords: { q: 1, r: 1 }, children: <GameTile currentPlayer={0} {...tile} /> };
};

export const createCellWithTileAndDrop = () => {
  const tile = { id: 2, playerId: 1, creature: 'ant', moves: [{ r: 0, q: 0 }] };
  return { coords: { q: 2, r: 2 }, children: <GameTile currentPlayer={0} {...tile} /> };
};

export const createCellNoDrop = () => ({ coords: { q: 6, r: 6 }, tiles: [] });

export const createCellCanDrop = createCellWithNoTile;
export const createCellWithTileNoDrop = createCellWithTile;

export const movingTile = {
  id: 2,
  moves: [
    { q: 0, r: 0 },
    { q: 2, r: 2 },
  ],
  creature: '',
  playerId: 1,
};
export const moveTileSpy = jest.fn();

export const createDispatcher = () => {
  const moveEvents: MoveEvent[] = [];
  const moveListener = (event: MoveEvent) => moveEvents.push(event);
  const dispatcher = getHiveDispatcher();
  dispatcher.add<MoveEvent>('move', moveListener);
  return moveEvents;
};

export const emitHiveEvent = (type: 'tileSelected' | 'tileDropped' | 'tileDeselected'): void => {
  act(() => {
    const dispatcher = getHiveDispatcher();
    dispatcher.dispatch({
      type,
      tile: movingTile,
    });
  }).catch(() => {});
};
