import { GameState } from './game-state';
import { Move } from './move';

export type HexEngine = {
    newGame: () => Promise<GameState>;

    moveTile: (move: Move) => Promise<GameState>;
};
