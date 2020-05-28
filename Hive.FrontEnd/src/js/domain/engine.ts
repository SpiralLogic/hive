import { GameState } from './game-state';
import { Move } from './move';

export interface HexEngine {
    newGame(): Promise<GameState>;
    move(move: Move): Promise<GameState>;
}
