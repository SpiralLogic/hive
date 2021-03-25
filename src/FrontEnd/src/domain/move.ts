import { HexCoordinates } from './hex-coordinates';
import { TileId } from './tile';

export type Move = {
  tileId: TileId;
  coords: HexCoordinates;
};
