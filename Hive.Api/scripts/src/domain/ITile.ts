import { IGameCoordinate } from './IGameCoordinate';
import { PlayerId } from './IPlayer';
import { TileContent } from './IContent';

/**
 * A player owned tile, containing ownership and style information,
 * as well as a list of possible positions that the tile could be
 * moved to.
 */
export interface ITile {
  /**
   * The _globally_ unique ID of the tile.
   */
  id: TileId;
  /**
   * The ID of the player that owns this tile
   */
  playerId: PlayerId;
  /**
   * Optional content to display for the tile
   */
  content: TileContent;
  /**
   * A list of cell coordinates that this tile may currently be moved to
   */
  availableMoves: IGameCoordinate[];
}

export type TileId = number;
