import { IEngine, IGameState, IMove } from './domain';
import { renderGame } from './components/Renderer';

const moveRequest = async (move: IMove) => {
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

const engine = (): IEngine => {
    return {
        async initialState (): Promise<IGameState> {
            return await newRequest();
        },
        async playMove (move: IMove): Promise<IGameState> {
            return await moveRequest(move);
        }
    };
};

renderGame({
    engine: engine(),
    container: document.getElementById('hive') as Element,
});