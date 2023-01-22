import { Move } from './move';
import { HexCoordinates } from './hex-coordinates';

export type HistoricalMove = {
  readonly move: Move;
  readonly originalCoords?: HexCoordinates;
};
