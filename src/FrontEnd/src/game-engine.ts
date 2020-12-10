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
    const response = await fetch('/api/new', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(''),
    });
    const gameState = await response.json();
    updateLocation(gameState);
    return gameState;
};

const Engine: HexEngine = {
    newGame: newRequest,
    moveTile: moveRequest,
};

export default Engine;
