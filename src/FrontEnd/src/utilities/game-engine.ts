import { GameConnection, GameHandlers, HexEngine, OpponentSelectionHandler } from '../domain/engine';
import { GameId, GameState, Move, Tile } from '../domain';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

const requestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const moveTile = async (gameId: GameId, move: Move): Promise<GameState> => {
  const response = await fetch(`/api/move/${gameId}`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(move),
  });

  return await response.json();
};

const getExistingGame = async (gameId: GameId): Promise<GameState> => {
  const response = await fetch(`/api/game/${gameId}`, {
    method: `GET`,
    headers: requestHeaders,
  });

  return response.json();
};

const getNewGame = async (): Promise<GameState> => {
  const response = await fetch(`/api/new`, {
    method: `POST`,
    headers: requestHeaders,
    body: JSON.stringify(''),
  });
  return response.json();
};

const connectGame = (gameId: GameId, handlers: GameHandlers): GameConnection => {
  const getConnection = (gameId: GameId): HubConnection => {
    const hubUrl = `${window.location.protocol}//${window.location.host}/gamehub/${gameId}`;
    const connection = new HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();
    connection.on('ReceiveGameState', handlers.updateGameState);
    if (handlers.opponentSelection) connection.on('OpponentSelection', handlers.opponentSelection);
    connection.start().then();
    return connection;
  };

  const connection = getConnection(gameId);

  const sendSelection: OpponentSelectionHandler = (type: 'select' | 'deselect', tile: Tile) =>
    connection.state === HubConnectionState.Connected &&
    connection.invoke('SendSelection', type, tile).catch(function (err) {
      return console.error(err.toString());
    });

  const closeConnection = () => {
    connection.off('ReceiveGameState', handlers.updateGameState);
    return connection.stop();
  };

  if (process.env.NODE_ENV !== 'production') {
    connection.onreconnecting((error) => console.warn(`reconnecting to game ${gameId} .. ${error}`));
    connection.onclose((error) => console.info(`connection closed to game ${gameId} .. ${error}`));
    connection.onreconnected((error) => {
      window.location.reload();
      console.info(`reconnected to game ${gameId} .. ${error}`);
    });
  }

  return {
    getConnectionState: () => connection.state,
    sendSelection,
    closeConnection,
  };
};

const Engine: HexEngine = {
  getNewGame,
  getExistingGame,
  moveTile,
  connectGame: connectGame,
};

export default Engine;
