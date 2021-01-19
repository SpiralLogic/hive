import {GameId, GameState, Move} from './domain';
import {GameStateHandlerDispose, GameStateUpdateHandler, HexEngine} from './domain/engine';
import {HubConnectionBuilder} from "@microsoft/signalr";

const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const updateLocationUrl = ({gameId}: GameState) => {
    window.history.replaceState({gameId}, document.title, `/game/${gameId}`);
}

const getGameId = () => window.history.state.gameId;

const moveRequest = async (move: Move): Promise<GameState> => {
    const gameId = getGameId();
    const response = await fetch(`/api/move/${gameId}`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(move),
    });

    const gameState = await response.json();
    updateLocationUrl(gameState);
    return gameState;
};

const newRequest = async (): Promise<GameState> => {
    const locationParts = window.location.pathname.split('/');
    const loadExistingGame = locationParts[1] === 'game' && locationParts[2]
    const gameState = (loadExistingGame) ? await getGameRequest(locationParts[2]) : await fetchNewGame();

    updateLocationUrl(gameState);
    return gameState;
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

const onUpdate = (handler: GameStateUpdateHandler): GameStateHandlerDispose => {
    const gameId = getGameId();
    const hubUrl = `${window.location.protocol}//${window.location.host}/gamehub/${gameId}`;
    const connection = new HubConnectionBuilder().withUrl(hubUrl).build();
    connection.start().then();
    connection.on("ReceiveGameState", handler)
    return () => {
        connection.off("ReceiveGameState", handler);
        connection.stop().then();
    }
}

const Engine: HexEngine = {
    newGame: newRequest,
    moveTile: moveRequest,
    onUpdate: onUpdate,
};

export default Engine;
