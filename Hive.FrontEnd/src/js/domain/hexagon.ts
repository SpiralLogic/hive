import { Tile } from './tile';
import { HexCoordinates } from './hex-coordinates';

export interface Hexagon {
    readonly coordinates: HexCoordinates;
    readonly tiles: Tile[];
}
