import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

import { GameId, PlayerId, Tile } from '../domain';
import {
  HexServerConnectionFactory,
  OpponentConnectedHandler,
  OpponentSelectionHandler,
  ServerConnectionConfig,
} from '../domain/engine';

class ServerConnection {
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
        console.warn(`reconnecting to game ${this.gameId} .. ${error}`),
      );
      this.connection.onclose((error) =>
        console.info(`connection closed to game ${this.gameId} .. ${error}`),
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

export const serverConnectionFactory: HexServerConnectionFactory = (config: ServerConnectionConfig) =>
  new ServerConnection(config);
