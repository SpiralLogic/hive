export interface IContent {
  type: 'image' | 'text';
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

export type TileContent = IImageContent | ITextContent;
export type ImageUrl = string | undefined;
export type Color = string;
