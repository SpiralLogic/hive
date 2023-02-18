import { HexCoordinate } from './hex-coordinate';
import { TileId } from './tile';

export type Move = {
  tileId: TileId;
  coords: HexCoordinate;
};
