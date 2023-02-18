import { HexCoordinates } from './hex-coordinate';
import { PlayerId } from './player';
import { Creature } from './creature';

export type Tile = {
  id: TileId;
  playerId: PlayerId;
  creature: Creature;
  moves: HexCoordinates;
};
export type Tiles = Tile[];
export type TileId = number;
export type TileMapKey = `${PlayerId}-${TileId}`;
