import { HexCoordinates } from './hex-coordinates';
import { TileId } from './tile';

export type Move = {
    tileId: TileId;
    coordinates: HexCoordinates;
}

export type MoveTile = (move: Move) => void;
