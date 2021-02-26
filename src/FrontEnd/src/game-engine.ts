import { GameConnection, GameStateUpdateHandler, HexEngine, OpponentSelectionHandler } from './domain/engine';
import { GameId, GameState, Move, TileId } from './domain';
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

const getGameRequest = async (gameId: GameId): Promise<GameState> => {
  const response = await fetch(`/api/game/${gameId}`, {
    method: `GET`,
    headers: requestHeaders,
  });

  return response.json();
};

const fetchNewGame = async (): Promise<GameState> => {
  const response = await fetch(`/api/new`, {
    method: `POST`,
    headers: requestHeaders,
    body: JSON.stringify(''),
  });
  return response.json();
};

const connectGame = (
  gameId: GameId,
  {
    updateGameState,
    opponentSelection,
  }: {
    updateGameState: GameStateUpdateHandler;
    opponentSelection?: OpponentSelectionHandler;
  }
): GameConnection => {
  const getConnection = (gameId: GameId): [HubConnection, Promise<void>] => {
    const hubUrl = `${window.location.protocol}//${window.location.host}/gamehub/${gameId}`;
    const connection = new HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();
    connection.on('ReceiveGameState', updateGameState);
    if (opponentSelection) connection.on('OpponentSelection', opponentSelection);
    return [connection, connection.start()];
  };

  const [connection] = getConnection(gameId);

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
    sendSelection: (type: 'select' | 'deselect', tileId: TileId) =>
      connection.state === HubConnectionState.Connected &&
      connection.invoke('SendSelection', type, tileId).catch(function (err) {
        return console.error(err.toString());
      }),
    closeConnection: () => {
      connection.off('ReceiveGameState', updateGameState);
      return connection.stop();
    },
  };
};

const Engine: HexEngine = {
  newGame: fetchNewGame,
  getGame: getGameRequest,
  moveTile,
  connectGame: connectGame,
};

export default Engine;
