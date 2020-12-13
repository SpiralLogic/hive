import { h } from "preact";
import Engine from '../game-engine';

jest.mock("@microsoft/signalr");
const signalR = require("@microsoft/signalr");
let withUrl = jest.fn();
let hubConnection = {
    start: jest.fn().mockResolvedValue(true),
    on: jest.fn().mockResolvedValue(true),
    stop: jest.fn().mockResolvedValue(true),
    off: jest.fn().mockResolvedValue(true),
};
beforeEach(function () {
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockImplementation(() => new Promise((resolve) => {
        resolve({
            ok: true,
            Id: '123',
            json: () => ({
                cells: [
                    { coords: { q: 0, r: 1 }, tiles: [] },
                    { coords: { q: 1, r: 1 }, tiles: [] },
                ],
                players: [
                    {
                        id: 0,
                        name: 'P1',
                        tiles: [
                            {
                                id: 0,
                                playerId: 0,
                                creature: 'bug',
                                moves: [{ q: 1, r: 1 }],
                            },
                        ],
                    },
                    {
                        id: 1,
                        name: 'P2',
                        tiles: [
                            {
                                id: 1,
                                playerId: 1,
                                creature: 'bug',
                                moves: [{ q: 1, r: 1 }],
                            },
                        ],
                    },
                ],
            }),
        });
    }));
    hubConnection = {
        start: jest.fn().mockResolvedValue(true),
        on: jest.fn().mockResolvedValue(true),
        stop: jest.fn().mockResolvedValue(true),
        off: jest.fn().mockResolvedValue(true),
    };
    signalR.HubConnection = jest.fn(() => hubConnection);
    withUrl = jest.fn().mockImplementation(() => ({
        build: jest.fn().mockImplementation(signalR.HubConnection)
    }));
    signalR.HubConnectionBuilder = jest.fn(() => (
        {
            withUrl: withUrl
        }));
});

describe('Game Engine', () => {
    it('new game', async () => {
        const response = await Engine.newGame();
        expect(response).not.toBeFalsy();
        expect(response.cells).toHaveLength(2);
        expect(response.players).toHaveLength(2);
    });

    it('existing game', async () => {
        const location = window.location;
        // @ts-ignore
        delete global.window.location;
        global.window.location = { ...location, pathname: '/game/33' };
        const response = await Engine.newGame();
        expect(global.fetch).toBeCalledWith("/api/game/33", { "headers": { "Accept": "application/json", "Content-Type": "application/json" }, "method": "GET" });
        expect(response).not.toBeFalsy();
        expect(response.cells).toHaveLength(2);
        expect(response.players).toHaveLength(2);
    });

    it('move tile', async () => {
        const response = await Engine.moveTile({
            tileId: 1,
            coords: { q: 0, r: 0 },
        });
        expect(response).not.toBeFalsy();
        expect(response.cells).toHaveLength(2);
        expect(response.players).toHaveLength(2);
    });

    it('calls onUpdate handler', () => {
        const handler = jest.fn();
        const dispose = Engine.onUpdate(handler);
        expect(withUrl).toBeCalledWith('http://localhost/gamehub');
    })

        it('websocket', () => {
            const handler = jest.fn();
            const dispose = Engine.onUpdate(handler);
            dispose();
            expect(hubConnection.stop).toBeCalled();
        })
    });
});
