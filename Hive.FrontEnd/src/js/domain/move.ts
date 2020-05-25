import { TileId } from './tile';
import { HexCoordinates } from './hex-coordinates';

export type Move = {
    tileId: TileId;
    coordinates: HexCoordinates;
}

export type MoveTile = (move: Move) => void;