import { Tile } from './tile';

export interface Player {
    id: PlayerId;
    name: PlayerName;
    availableTiles: Tile[];
}

export type PlayerId = number;
export type PlayerName = string;
