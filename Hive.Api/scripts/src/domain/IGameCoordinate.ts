/**
 * Game space axial coordinates
 * @see https://www.redblobgames.com/grids/hexagons/#coordinates-axial
 */
export interface IGameCoordinate {
  q: number;
  r: number;
}


export const areEqual = (a: IGameCoordinate, b: IGameCoordinate) => {
  return a && b && a.q === b.q && a.r === b.r;
};

export const isValidMove = (move: IGameCoordinate, validMoves: IGameCoordinate[]) => {
  return validMoves.some(dest => areEqual(move, dest));
};

export const coordinateAsId = ({ q, r }: IGameCoordinate) => `${q}-${r}`;
