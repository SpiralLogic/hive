import { GameId, GameState } from './game-state';
import { HubConnectionState } from '@microsoft/signalr';
import { Move } from './move';
import { TileId } from './tile';

export type GameStateUpdateHandler = (gameState: GameState) => void;
export type OpponentSelectionHandler = (type: 'select' | 'deselect', tileId: TileId) => void;
export type GameConnection = {
  getConnectionState: () => HubConnectionState;
  closeConnection: () => Promise<void>;
  sendSelection: OpponentSelectionHandler;
};
export type HexEngine = {
  connectGame: (
    gameId: GameId,
    handlers: {
      updateGameState: GameStateUpdateHandler;
      opponentSelection?: OpponentSelectionHandler;
    }
  ) => GameConnection;
  newGame: () => Promise<GameState>;
  moveTile: (gameId: GameId, move: Move) => Promise<GameState>;
  getGame: (gameId: GameId) => Promise<GameState>;
};
