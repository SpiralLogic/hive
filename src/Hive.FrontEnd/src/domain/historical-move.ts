import { Move } from './move';
import { HexCoordinates } from './hex-coordinates';

export type HistoricalMove = {
  move: Move;
  originalCoords?: HexCoordinates;
};
