import { HexCoordinates } from './hex-coordinates';
import { Tile } from './tile';

export type Hexagon = {
    coordinates: HexCoordinates;
    tiles: Tile[];
}
