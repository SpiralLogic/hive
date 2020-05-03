import { IGameCoordinate } from './IGameCoordinate';
import { TileId } from './ITile';

/**
 * Describes a single game move
 */
export interface IMove {
  /**
   * The ID of the tile that was moved
   */
  tileId: TileId;
  /**
   * The coordinate to which the tile was moved
   */
  coordinates: IGameCoordinate;
}