import {Tile} from './tile';
import {HexCoordinates} from './hex-coordinates';

export type Hexagon = {
    coordinates: HexCoordinates;
    tiles: Tile[];
}
