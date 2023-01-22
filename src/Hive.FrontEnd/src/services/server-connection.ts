import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

import { GameId, GameState, PlayerId, Tile } from '../domain';

export type PlayerSelectionEvent = 'select' | 'deselect';
export type PlayerConnectionEvent = 'connect' | 'disconnect';
export type GameStateUpdateHandler = (gameState: GameState) => void;
export type OpponentSelectionHandler = (type: PlayerSelectionEvent, tile: Tile) => void;
export type OpponentConnectedHandler = (type: PlayerConnectionEvent) => void;
export type ServerConnectionConfig = {
  currentPlayer: PlayerId;
  gameId: GameId;
  updateHandler: GameStateUpdateHandler;
  opponentSelectionHandler: OpponentSelectionHandler;
  opponentConnectedHandler: OpponentConnectedHandler;
};
export interface ServerConnection {
  connectGame: () => Promise<void>;
  getConnectionState: () => HubConnectionState;
  sendSelection: OpponentSelectionHandler;
  closeConnection: () => Promise<void>;
}
class ServerConnectionImpl implements ServerConnection {
  private readonly updateHandler;

  private readonly gameId: GameId;

  private readonly connection: HubConnection;

  private readonly opponentSelectionHandler: OpponentSelectionHandler;

  private readonly opponentConnectedHandler: OpponentConnectedHandler;

  private readonly currentPlayer: PlayerId;

  constructor(config: ServerConnectionConfig) {
    const { currentPlayer, gameId, updateHandler, opponentSelectionHandler, opponentConnectedHandler } =
      config;
    this.currentPlayer = currentPlayer;
    this.gameId = gameId;
    this.opponentSelectionHandler = opponentSelectionHandler;
    this.opponentConnectedHandler = opponentConnectedHandler;
    this.updateHandler = updateHandler;
    this.connection = this.createConnection();
  }

  connectGame = (): Promise<void> => {
    if (!import.meta.env.PROD) {
      this.connection.onreconnecting((error) =>
        console.warn(`reconnecting to game ${this.gameId} .. ${error}`)
      );
      this.connection.onclose((error) =>
        console.info(`connection closed to game ${this.gameId} .. ${error}`)
      );
      this.connection.onreconnected((error) => {
        window.location.reload();
        console.info(`reconnected to game ${this.gameId} .. ${error}`);
      });
    }
    return this.connection.start();
  };

  getConnectionState = (): HubConnectionState => this.connection.state;

  sendSelection: OpponentSelectionHandler = (type: 'select' | 'deselect', tile: Tile) => {
    if (this.connection.state === HubConnectionState.Connected)
      this.connection
        .send('SendSelection', type, tile)
        .catch((error: Error) => console.error(error.message.toString()));
  };

  closeConnection = (): Promise<void> => {
    this.connection.off('ReceiveGameState', this.updateHandler);
    return this.connection.stop();
  };

  private createConnection = () => {
    const hubUrl = `${window.location.protocol}//${window.location.host}/gamehub/${this.gameId}/${this.currentPlayer}`;
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();
    connection.on('ReceiveGameState', this.updateHandler);
    connection.on('OpponentSelection', this.opponentSelectionHandler);
    connection.on('PlayerConnection', this.opponentConnectedHandler);
    return connection;
  };
}
export type ServerConnectionFactory = (config: ServerConnectionConfig) => ServerConnection;
export const serverConnectionFactory = (config: ServerConnectionConfig) => new ServerConnectionImpl(config);
