import {Tile} from './tile';
import {HexCoordinates} from './hex-coordinates';

export interface Hexagon {
    coordinates: HexCoordinates;
    tiles: Tile[];
}
