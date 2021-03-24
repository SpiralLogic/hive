import { GameId, GameState } from './game-state';
import { HexCoordinates } from './hex-coordinates';
import { TileId } from './tile';

export type Move = {
  tileId: TileId;
  coords: HexCoordinates;
};
