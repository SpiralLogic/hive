import { HexCoordinates } from './hex-coordinates';
import { PlayerId } from './player';

export type Tile = {
  id: TileId;
  playerId: PlayerId;
  creature: TileCreature;
  moves: HexCoordinates[];
};

export type TileId = number;
export type TileCreature = string;
