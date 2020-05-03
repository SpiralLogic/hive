import { ITile } from './ITile';
import { Color } from './IContent';

/**
 * Represents a single player, including identifying data, colors,
 * and available, unplaced tiles belonging to that player.
 */
export interface IPlayer {
  /**
   * Unique id of the player. Used to reference a player when making a move
   * or to indicate to whom a specific tile belongs
   */
  id: PlayerId;
  /**
   * The display name of the player
   */
  name: PlayerName;
  /**
   * The identifying color of the player. Used as a default for any tiles
   * owned by the player.
   */
  color: Color;
  /**
   * Optional background color to use for this players tile list box
   */
  tileListColor?: Color;
  /**
   * A list of tiles owned by this player that are available but not
   * yet placed in a cell.
   */
  availableTiles: ITile[];
}

export type PlayerId = string;
export type PlayerName = string;