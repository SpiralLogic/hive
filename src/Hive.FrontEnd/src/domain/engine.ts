import { HubConnectionState } from '@microsoft/signalr';

import { GameId, GameState } from './game-state';
import { Move } from './move';
import { PlayerId } from './player';
import { Tile } from './tile';

export type PlayerSelectionEvent = 'select' | 'deselect';
export type PlayerConnectionEvent = 'connect' | 'disconnect';
export type GameStateUpdateHandler = (gameState: GameState) => void;
export type OpponentSelectionHandler = (type: PlayerSelectionEvent, tile: Tile) => void;
export type OpponentConnectedHandler = (type: PlayerConnectionEvent) => void;
export type EngineMove = (move: Move) => Promise<GameState>;
export type AiMode = 'on' | 'off' | 'auto';
export type HexEngine = {
  currentPlayer: PlayerId;
  aiMode: AiMode;
  initialGame: Promise<GameState>;
  move: EngineMove;
};

export type ServerConnectionConfig = {
  currentPlayer: PlayerId;
  gameId: GameId;
  updateHandler: GameStateUpdateHandler;
  opponentSelectionHandler: OpponentSelectionHandler;
  opponentConnectedHandler: OpponentConnectedHandler;
};

export type HexServerConnectionFactory = (config: Required<ServerConnectionConfig>) => {
  connectGame: () => Promise<void>;
  getConnectionState: () => HubConnectionState;
  closeConnection: () => Promise<void>;
  sendSelection: OpponentSelectionHandler;
};
