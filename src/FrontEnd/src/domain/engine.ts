import {GameId, GameState} from './game-state';
import {Move} from './move';

export type GameStateUpdateHandler = (gameState: GameState) => void;

export type HexEngine = {
    connectGame: (gameId: GameId, handler: GameStateUpdateHandler) => { getConnectionState:()=> Promise<  "Disconnected" | "Connecting" | "Connected" | "Disconnecting" | "Reconnecting">,closeConnection: () => Promise<void> };
    newGame: () => Promise<GameState>;
    moveTile: (gameId: GameId, move: Move) => Promise<GameState>;
    getGameRequest: (gameId: GameId) => Promise<GameState>;
};
