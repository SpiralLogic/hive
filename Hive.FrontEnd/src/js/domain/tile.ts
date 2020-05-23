import { PlayerId } from './player';
import { HexCoordinates } from './hex-coordinates';

export interface Tile {
    id: TileId;
    playerId: PlayerId;
    content: TileContent;
    availableMoves: HexCoordinates[];
}

export type TileId = number;
export type TileContent = string;
