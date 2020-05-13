import { HexEngine, GameState, Move } from './domain';
import { renderGame } from './components';

const moveRequest = async (move: Move) => {
    const f = new URLSearchParams();
    const { tileId, coordinates } = move;
    f.append('tileId', tileId.toString());
    f.append('coordinates[q]', move.coordinates.q.toString());
    f.append('coordinates[r]', move.coordinates.r.toString());
    let response = await fetch('https://localhost:5001/move',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: f
        });

    return await response.json();
};

const newRequest = async () => {
    let response = await fetch('https://localhost:5001/new',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(''),
        });

    return await response.json();
};

const engine = (): HexEngine => {
    return {
        async initialState (): Promise<GameState> {
            return await newRequest();
        },
        async moveTile (move: Move): Promise<GameState> {
            return await moveRequest(move);
        }
    };
};

renderGame({
    engine: engine(),
    container: document.getElementById('hive') as Element,
});