import { GameState } from './game-state';
import { Move } from './move';

export interface HexEngine {
    newGame(): Promise<GameState>;

    moveTile(move: Move): Promise<GameState>;
}
