import { Tile } from './tile';

export type Player = {
  id: number;
  name: string;
  tiles: Array<Tile>;
};

export type Players = Player[];
