import { Cell } from './cell';
import { Player } from './player';

export type GameState = {
  cells: Cell[];
  players: Player[];
  gameId: GameId;
  gameStatus: string;
};

export type GameId = string;
