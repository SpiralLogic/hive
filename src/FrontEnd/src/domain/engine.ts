import { GameId, GameState } from './game-state';
import { HubConnectionState } from '@microsoft/signalr';
import { Move } from './move';
import { Tile } from './tile';

export type GameStateUpdateHandler = (gameState: GameState) => void;
export type OpponentSelectionHandler = (type: 'select' | 'deselect', tile: Tile) => void;
export type GameConnection = {
  getConnectionState: () => HubConnectionState;
  closeConnection: () => Promise<void>;
  sendSelection: OpponentSelectionHandler;
};
export type GameHandlers = {
  updateGameState: GameStateUpdateHandler;
  opponentSelection?: OpponentSelectionHandler;
};
export type HexEngine = {
  connectGame: (gameId: GameId, handlers: GameHandlers) => GameConnection;
  getNewGame: () => Promise<GameState>;
  moveTile: (gameId: GameId, move: Move) => Promise<GameState>;
  getExistingGame: (gameId: GameId) => Promise<GameState>;
};
