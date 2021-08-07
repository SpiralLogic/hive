import { HexCoordinates } from './hex-coordinates';

export type Tile = {
  id: TileId;
  playerId: PlayerId;
  creature: TileCreature;
  moves: HexCoordinates[];
};

type PlayerId = number;
export type TileId = number;
export type TileCreature = string;
