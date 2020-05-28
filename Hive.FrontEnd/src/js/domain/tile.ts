import { HexCoordinates } from './hex-coordinates';
import { PlayerId } from './player';

export interface Tile {
    id: TileId;
    playerId: PlayerId;
    content: TileContent;
    availableMoves: HexCoordinates[];
}

export type TileId = number;
export type TileContent = string;
