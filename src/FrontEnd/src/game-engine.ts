import {GameState, Move} from './domain';
import {HexEngine} from './domain/engine';

const moveRequest = async (move: Move): Promise<GameState> => {
    const response = await fetch(`/api/move/${window.history.state.id}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(move),
    });

    const gameState = await response.json();
    updateLocation(gameState);
    return gameState;
};

const updateLocation = ({id}: { id: string }) => {
    window.history.replaceState({id}, document.title, `/game/${id}`);
}

const newRequest = async (): Promise<GameState> => {
    const locationParts = window.location.pathname.split('/');
    const loadExistingGame = locationParts[1] === 'game' && locationParts[2]
    const response = (loadExistingGame) ? await fetchExistingGame(locationParts[2]) : await fetchNewGame();
    const gameState = await response.json();
    updateLocation(gameState);
    return gameState;
};

const fetchExistingGame = (id: string) => fetch(`/api/game/${id}`, {
    method: `GET`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

const fetchNewGame = () => fetch(`/api/new`, {
    method: `POST`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(''),
});

const Engine: HexEngine = {
    newGame: newRequest,
    moveTile: moveRequest,
};

export default Engine;
