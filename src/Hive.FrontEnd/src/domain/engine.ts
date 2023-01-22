import { GameState } from './game-state';
import { Move } from './move';
import { PlayerId } from './player';

export type EngineMove = (move: Move) => Promise<GameState>;
export type AiMode = 'on' | 'off' | 'auto';
export type HexEngine = {
  currentPlayer: PlayerId;
  setAiMode: (mode: AiMode) => void;
  getAiMode: () => AiMode;
  initialGame: Promise<GameState>;
  move: EngineMove;
};
