import { GameState } from './game-state';
import { Move } from './move';

export type EngineMove = (move: Move) => Promise<GameState>;
export type AiMode = 'on' | 'off' | 'auto';
export type HexEngine = {
  currentPlayer: number;
  aiMode: AiMode;
  onAiMode?: (aiMode: AiMode) => void;
  initialGame: Promise<GameState>;
  move: EngineMove;
};
