import { Tile } from './tile';
import { HexCoordinates } from './hexCoordinates';

export interface Hexagon {
    readonly coordinates: HexCoordinates;
    readonly  tiles: Tile[];
}