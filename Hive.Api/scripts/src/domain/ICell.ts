import { ITile } from './ITile';
import { IGameCoordinate } from './IGameCoordinate';

/**
 * A single position on the hexagonal grid. May contain
 * one or more player-owned tiles
 */
export interface ICell {
  /**
   * The axial-coordinate position of the cell
   */
  coordinates: IGameCoordinate;
  
  /**
   * The 'stack' of tiles in this cell. The first tile is considered
   * to be 'on top'
   */
  tiles: ITile[];
}