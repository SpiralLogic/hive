import {GameId, GameState, Move} from './domain';
import {GameStateUpdateHandler, HexEngine} from './domain/engine';
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

const getConnection = async (gameId: GameId, prevConnection?: HubConnection | undefined) => {
    if (prevConnection !== undefined && prevConnection.state === HubConnectionState.Connected) return prevConnection;
    const hubUrl = `${window.location.protocol}//${window.location.host}/gamehub/${gameId}`;
    const newConnection = new HubConnectionBuilder().withUrl(hubUrl).build();
    await newConnection.start();
    return newConnection;
}

const connectGame = (gameId: GameId, handler: GameStateUpdateHandler) => {
    let connection: HubConnection | undefined;

    getConnection(gameId).then((c) => {
        connection = c;
        connection.on("ReceiveGameState", onUpdate)
    });

    const onUpdate = (gameState: GameState) => {
        if (gameId !== gameState.gameId) return;
        handler(gameState)
    };

    return {
        getConnectionState: async () => ((await getConnection(gameId, connection)).state ?? HubConnectionState.Disconnected),
        closeConnection: async () => {
            connection = await getConnection(gameId, connection);
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
