import { HexCoordinate } from './hex-coordinate';
import { Tiles } from './tile';

export type Cell = {
  readonly coords: HexCoordinate;
  tiles: Tiles;
};
export type Cells = Cell[];
