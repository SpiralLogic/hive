import { Cell } from './cell';
import { Player } from './player';

export type GameState = {
  cells: Cell[];
  players: Player[];
  gameId: GameId;
  gameStatus: GameStatus
};

export type GameId = string;
export type GameStatus =
  | 'NewGame'
  | 'MoveSuccess'
  | 'AiWin'
  | 'Player0Win'
  | 'Player1Win'
  | 'MoveSuccessNextPlayerSkipped'
  | 'MoveInvalid'
  | 'GameOver' | 'Draw';
