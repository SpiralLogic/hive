export interface ITextContent {
  /**
   * Must be `'text'`
   */
  type: 'text';
  /**
   * The text to display
   */
  text: string;
}

export type TileContent = ITextContent;
export type Color = string;
