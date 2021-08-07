import { HexCoordinates } from './hex-coordinates';
import { Tile } from './tile';

export type Cell = {
  coords: HexCoordinates;
  tiles: Tile[];
};
