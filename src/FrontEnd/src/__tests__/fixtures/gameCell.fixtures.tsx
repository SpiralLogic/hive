import { h } from 'preact';
import GameTile from '../../components/GameTile';

export const createCellWithNoTile = () => ({ coords: { q: 0, r: 0 }, tiles: [] });

export const createCellWithTile = () => {
  const tile = { id: 2, playerId: 1, creature: 'fly', moves: [] };
  const cell = { coords: { q: 1, r: 1 }, children: <GameTile {...tile} /> };

  return cell;
};

export const createCellWithTileAndDrop = () => {
  const tile = { id: 2, playerId: 1, creature: 'ant', moves: [{ r: 0, q: 0 }] };
  const cell = { coords: { q: 2, r: 2 }, children: <GameTile {...tile} /> };

  return cell;
};

export const createCellNoDrop = () => {
  const cell = { coords: { q: 6, r: 6 }, tiles: [] };
  return cell;
};

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
