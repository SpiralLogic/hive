import {GameState, Move} from './domain';
import {HexEngine} from './domain/engine';

const moveRequest = async (move: Move): Promise<GameState> => {
    const response = await fetch('https://localhost:5001/move', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(move),
    });

    return response.json();
};

const newRequest = async (): Promise<GameState> => {
    const response = await fetch('https://localhost:5001/new', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(''),
    });

    return response.json();
};

const Engine: HexEngine = {
    newGame: newRequest,
    moveTile: moveRequest,
};

export default Engine;
