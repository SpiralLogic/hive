import { Cells } from './cell';
import { Players } from './player';
import { HistoricalMoves } from './historical-move';

export type GameState = {
  cells: Cells;
  players: Players;
  gameId: string;
  gameStatus: GameStatus;
  history: HistoricalMoves;
};

export type GameStatus =
  | 'NewGame'
  | 'MoveSuccess'
  | 'AiWin'
  | 'Player0Win'
  | 'Player1Win'
  | 'MoveSuccessNextPlayerSkipped'
  | 'MoveInvalid'
  | 'GameOver'
  | 'Draw';
