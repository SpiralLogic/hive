import { GameState } from './gameState';
import { Move } from './move';

export interface HexEngine {
  initialState (): Promise<GameState>;
  moveTile (move: Move): Promise<GameState>;
}