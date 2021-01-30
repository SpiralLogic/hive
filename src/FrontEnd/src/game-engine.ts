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

    return await response.json();
}

const fetchNewGame = async (): Promise<GameState> => {
    const response = await fetch(`/api/new`, {
        method: `POST`,
        headers: requestHeaders,
        body: JSON.stringify(''),
    });
    return await response.json();
};


const connectGame = (gameId: GameId, handler: GameStateUpdateHandler): GameConnection => {
    const getConnection = (gameId: GameId): [HubConnection, Promise<void>] => {
        const hubUrl = `${window.location.protocol}//${window.location.host}/gamehub/${gameId}`;
        const connection = new HubConnectionBuilder().withUrl(hubUrl).build();
        return [connection, connection.start()];
    }

    const [connection, startPromise] = getConnection(gameId);

    startPromise.then(() => {
        connection.on("ReceiveGameState", handler);
    });

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
