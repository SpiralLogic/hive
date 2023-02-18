import { HexCoordinate } from './hex-coordinate';
import { Tile } from './tile';

export type HistoricalMove = {
  readonly move: { tile: Omit<Tile, 'moves' | 'creature'>; coords: HexCoordinate };
  readonly originalCoords?: HexCoordinate;
  readonly aiMove?: boolean;
};

export type HistoricalMoves = HistoricalMove[];
