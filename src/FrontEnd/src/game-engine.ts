import {GameConnection, GameStateUpdateHandler, HexEngine} from './domain/engine';
import {GameId, GameState, Move} from './domain';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";

const requestHeaders = {
    'Accept': 'application/json',
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

    return  response.json();
}

const fetchNewGame = async (): Promise<GameState> => {
    const response = await fetch(`/api/new`, {
        method: `POST`,
        headers: requestHeaders,
        body: JSON.stringify(''),
    });
    return  response.json();
};


const connectGame = (gameId: GameId, handler: GameStateUpdateHandler): GameConnection => {
    const getConnection = (gameId: GameId): [HubConnection, Promise<void>] => {
        const hubUrl = `${window.location.protocol}//${window.location.host}/gamehub/${gameId}`;
        const connection = new HubConnectionBuilder().withUrl(hubUrl).build();
        connection.on("ReceiveGameState", handler);
        return [connection, connection.start()];
    }

    const [connection, startPromise] = getConnection(gameId);



    return {
        getConnectionState: () => connection.state,
        closeConnection: async () => {
            if (connection.state !== HubConnectionState.Connected) return;
            connection.off("ReceiveGameState", handler);
            connection.stop().then();
        }
    }
}

const Engine: HexEngine = {
    newGame: fetchNewGame,
    getGame: getGameRequest,
    moveTile,
    connectGame: connectGame,
};

export default Engine;
