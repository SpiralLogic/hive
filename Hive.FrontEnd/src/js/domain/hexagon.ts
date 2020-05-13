import { Tile } from './tile';
import { HexCoordinates } from './hexCoordinates';

export interface Hexagon {
  coordinates: HexCoordinates;
  tiles: Tile[];
}