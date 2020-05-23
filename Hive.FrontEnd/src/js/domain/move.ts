import { TileId } from './tile';
import { HexCoordinates } from './hex-coordinates';

export interface Move {
    tileId: TileId;
    coordinates: HexCoordinates;
}
