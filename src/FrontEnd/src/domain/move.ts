import { GameId, GameState } from './game-state';
import { HexCoordinates } from './hex-coordinates';
import { TileId } from './tile';

export type Move = {
  tileId: TileId;
  coords: HexCoordinates;
  useAi?: Boolean;
};

export type MoveTile = (gameId: GameId, move: Move) => Promise<GameState>;
