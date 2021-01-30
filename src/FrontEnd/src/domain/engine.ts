import {GameId, GameState} from './game-state';
import {HubConnectionState} from "@microsoft/signalr";
import {Move} from './move';

export type GameStateUpdateHandler = (gameState: GameState) => void;
export type GameConnection = { getConnectionState: () => HubConnectionState, closeConnection: () => Promise<void> };
export type HexEngine = {
    connectGame: (gameId: GameId, handler: GameStateUpdateHandler) => GameConnection;
    newGame: () => Promise<GameState>;
    moveTile: (gameId: GameId, move: Move) => Promise<GameState>;
    getGame: (gameId: GameId) => Promise<GameState>;
};
