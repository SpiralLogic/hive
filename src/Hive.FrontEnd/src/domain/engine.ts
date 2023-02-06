import { GameState } from './game-state';
import { Move } from './move';
import { PlayerId } from './player';
import { Signal } from '@preact/signals';

export type EngineMove = (move: Move) => Promise<GameState>;
export type AiMode = 'on' | 'off' | 'auto';
export type HexEngine = {
  currentPlayer: PlayerId;
  getAiMode: () => Signal<AiMode>;
  initialGame: Promise<GameState>;
  move: EngineMove;
};
