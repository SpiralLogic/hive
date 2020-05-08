import { ITile } from './ITile';

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

  availableTiles: ITile[];
}

export type PlayerId = number;
export type PlayerName = string;