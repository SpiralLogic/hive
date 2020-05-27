import Engine from '../game-engine';

beforeEach(function () {

    global.fetch = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                Id: '123',
                json: () => ({
                        'hexagons':
                            [{ 'coordinates': { 'q': 0, 'r': 1 }, 'tiles': [] },
                                { 'coordinates': { 'q': 1, 'r': 1 }, 'tiles': [] }],
                        'players':
                            [
                                { 'id': 0, 'name': 'P1', 'availableTiles': [{ 'id': 0, 'playerId': 0, 'content': 'bug', 'availableMoves': [{ 'q': 1, 'r': 1 }] }] },
                                { 'id': 1, 'name': 'P2', 'availableTiles': [{ 'id': 1, 'playerId': 1, 'content': 'bug', 'availableMoves': [{ 'q': 1, 'r': 1 }] }] }
                            ]
                    }
                )
            });
        });
    });
});

describe('Game Engine', () => {
    it('initialState', async function () {
        const response = await Engine.initialState();
        expect(response).not.toBeFalsy();
        expect(response.hexagons).toHaveLength(2);
        expect(response.players).toHaveLength(2);
    });

    it('make move', async function () {
        const response = await Engine.moveTile({ tileId: 1, coordinates: { q: 0, r: 0 } });
        expect(response).not.toBeFalsy();
        expect(response.hexagons).toHaveLength(2);
        expect(response.players).toHaveLength(2);
    });
});
