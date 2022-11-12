import { Tile } from './tile';

export type Player = {
  id: PlayerId;
  name: PlayerName;
  tiles: Array<Tile>;
};

export type PlayerId = number | string;
export type PlayerName = string;
export type Players = Array<Player>;
