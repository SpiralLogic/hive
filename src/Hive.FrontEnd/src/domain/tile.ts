import { HexCoordinates } from './hex-coordinate';
import { Creature } from './creature';

export type Tile = {
  id: number;
  playerId: number;
  creature: Creature;
  moves: HexCoordinates;
};
export type Tiles = Tile[];
export type TileMapKey = `${number}-${number}`;
