import * as React from "react";

export type PlayerId = string;
export type PlayerName = string;
export type TileId = string;
export type Color = string;
export type ImageUrl = string | undefined;

/**
 * Represents a single, complete, point-in-time snapshot of a game
 * including players, cells, and tiles on the board along with available moves
 * and style customisations.
 */
export interface IGameState {
  /**
   * A list of all known cells in the game
   */
  cells: ICell[];
  /**
   * A list of all players in the game
   */
  players: IPlayer[];
}

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
   * Optional color to use when displaying the cell
   */
  color?: Color;
  /**
   * The 'stack' of tiles in this cell. The first tile is considered
   * to be 'on top'
   */
  tiles: ITile[];
}

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
   * Optional display color of this tile. If none is provided,
   * will default to the owning player's color.
   */
  color?: Color;
  /**
   * Optional content to display for the tile
   */
  content?: TileContent;
  /**
   * A list of cell coordinates that this tile may currently be moved to
   */
  availableMoves: IGameCoordinate[];
}

export interface IContent {
  type: 'image' | 'react' | 'text';
}

/**
 * Specifies an image to display in a tile
 */
export interface IImageContent extends IContent {
  /**
   * Must be `'image'`
   */
  type: 'image';
  /**
   * Url of the image to be displayed
   */
  url: ImageUrl;
}

/**
 * Provides a react component to mount within the tile
 */
export interface IReactContent extends IContent {
  /**
   * Must be `'react'`
   */
  type: 'react';
  /**
   * The component class to render.
   */
  component: React.ComponentType;
}

/**
 * Specifies text to be displayed within the tile
 */
export interface ITextContent extends IContent {
  /**
   * Must be `'text'`
   */
  type: 'text';
  /**
   * The text to display
   */
  text: string;
}

export type TileContent = IImageContent | IReactContent | ITextContent;

/**
 * Game space axial coordinates
 * @see https://www.redblobgames.com/grids/hexagons/#coordinates-axial
 */
export interface IGameCoordinate {
  q: number;
  r: number;
}

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

/**
 * A rules engine to plug into the renderer. Allows the renderer
 * to request an initial game state, and updated states based on
 * moves
 */
export interface IEngine {
  /**
   * Returns a promise resolving the initial state of a new game.
   * Will be called before the initial render.
   * @returns Promise<IGameState>
   */
  initialState(): Promise<IGameState>;
  /**
   * When provided with a move, will return a promise resolving the
   * resulting 'next' game state.
   * @param move A tile move performed by a plaer
   */
  playMove(move: IMove): Promise<IGameState>;
}
