import { HexCoordinates } from './hex-coordinates';
import { TileId } from './tile';

export type Move = {
    tileId: TileId;
    coords: HexCoordinates;
}

export type MoveTile = (move: Move) => void;
