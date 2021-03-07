import { GameId, GameState } from './game-state';
import { HubConnectionState } from '@microsoft/signalr';
import { Move } from './move';
import { Tile } from './tile';

export type PlayerSelectionEvent = 'select' | 'deselect';
export type GameStateUpdateHandler = (gameState: GameState) => void;
export type OpponentSelectionHandler = (type: PlayerSelectionEvent, tile: Tile) => void;

export type HexEngine = {
  getNewGame: () => Promise<GameState>;
  moveTile: (gameId: GameId, move: Move) => Promise<GameState>;
  getExistingGame: (gameId: GameId) => Promise<GameState>;
};
export type HexServerConnection = {
  connectGame: () => Promise<void>;
  getConnectionState: () => HubConnectionState;
  closeConnection: () => Promise<void>;
  sendSelection: OpponentSelectionHandler;
};
