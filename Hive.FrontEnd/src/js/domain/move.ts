import { TileId } from './Tile';
import { HexCoordinates } from './hexCoordinates';

export interface Move {
  tileId: TileId;
  coordinates: HexCoordinates;
}