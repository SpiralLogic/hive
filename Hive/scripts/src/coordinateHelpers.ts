import { IGameCoordinate } from './domain';

export const areEqual = (a: IGameCoordinate, b: IGameCoordinate) => {
  return a && b && a.q === b.q && a.r === b.r;
};

export const validMove = (move: IGameCoordinate, validMoves: IGameCoordinate[]) => {
  return validMoves.some(dest => areEqual(move, dest));
};

export const coordId = ({ q, r }: IGameCoordinate) => `${q}-${r}`;
