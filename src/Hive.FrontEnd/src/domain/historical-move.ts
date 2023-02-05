import { HexCoordinates } from './hex-coordinates';
import { Tile } from './tile';

export type HistoricalMove = {
  readonly move: { tile: Omit<Tile, 'moves' | 'creature'>; coords: HexCoordinates };
  readonly originalCoords?: HexCoordinates;
  readonly aiMove?: boolean;
};
