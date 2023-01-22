import { HexCoordinates } from './hex-coordinates';
import { Tile } from './tile';

export type Cell = {
  readonly coords: HexCoordinates;
  tiles: Array<Tile>;
};
