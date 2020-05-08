/**
 * Game space axial coordinates
 * @see https://www.redblobgames.com/grids/hexagons/#coordinates-axial
 */
export interface IGameCoordinate {
  q: number;
  r: number;
}

export const coordinateAsId = ({ q, r }: IGameCoordinate) => `${q}-${r}`;
