import Engine from '../game-engine';

beforeEach(function () {
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                Id: '123',
                json: () => ({
                    cells: [
                        { coords: { q: 0, r: 1 }, tiles: [] },
                        { coords: { q: 1, r: 1 }, tiles: [] },
                    ],
                    players: [
                        { id: 0, name: 'P1', tiles: [{ id: 0, playerId: 0, content: 'bug', moves: [{ q: 1, r: 1 }] }] },
                        { id: 1, name: 'P2', tiles: [{ id: 1, playerId: 1, content: 'bug', moves: [{ q: 1, r: 1 }] }] },
                    ],
                }),
            });
        });
    });
});

describe('Game Engine', () => {
    it('new game', async function () {
        const response = await Engine.newGame();
        expect(response).not.toBeFalsy();
        expect(response.cells).toHaveLength(2);
        expect(response.players).toHaveLength(2);
    });

    it('move tile', async function () {
        const response = await Engine.moveTile({ tileId: 1, coords: { q: 0, r: 0 } });
        expect(response).not.toBeFalsy();
        expect(response.cells).toHaveLength(2);
        expect(response.players).toHaveLength(2);
    });
});
