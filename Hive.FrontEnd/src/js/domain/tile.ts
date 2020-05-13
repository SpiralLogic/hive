import { PlayerId } from './player';
import { HexCoordinates } from './hexCoordinates';
import { TextContent } from './textContent';

export interface Tile {
    id: TileId;
    playerId: PlayerId;
    content: TextContent;
    availableMoves: HexCoordinates[];
}

export type TileId = number;