import { GameState, Move } from './domain';

const moveRequest = async (move: Move) => {
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

const newRequest = async () => {
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

export const Engine = {
    initialState(): Promise<GameState> {
        return newRequest();
    },
    moveTile(move: Move): Promise<GameState> {
        return moveRequest(move);
    },
};
