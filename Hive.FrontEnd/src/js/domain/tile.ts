import { HexCoordinates } from './hex-coordinates';
import { PlayerId } from './player';

export interface Tile {
    id: TileId;
    playerId: PlayerId;
    content: TileContent;
    moves: HexCoordinates[];
}

export type TileId = number;
export type TileContent = string;
