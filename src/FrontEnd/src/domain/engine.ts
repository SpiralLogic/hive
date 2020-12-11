import {GameState} from './game-state';
import {Move} from './move';

export type GameStateUpdateHandler = (gameState: GameState) => void;
export type GameStateHandlerDispose = ()=>void;
export type HexEngine = {
    onUpdate: (handler: GameStateUpdateHandler) => GameStateHandlerDispose;
    newGame: () => Promise<GameState>;
    moveTile: (move: Move) => Promise<GameState>;
};