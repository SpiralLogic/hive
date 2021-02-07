import { Tile } from './tile';

export type Player = {
  id: PlayerId;
  name: PlayerName;
  tiles: Tile[];
};

export type PlayerId = number;
export type PlayerName = string;
