/* eslint-disable @typescript-eslint/ban-ts-comment */
import Engine from '../game-engine';
import gameState from './fixtures/gameState.json';

jest.mock("@microsoft/signalr");

describe('GameEngine', () => {
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
        global.fetch = jest.fn().mockImplementation(() => ({ok: true, json: jest.fn().mockResolvedValue(gameState)}));

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
        signalR.HubConnectionBuilder = jest.fn().mockImplementation(() => (
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
            // @ts-ignore
            global.window.location = {...location, pathname: '/game/33'};

            const response = await Engine.newGame();
            expect(global.fetch).toBeCalledWith("/api/game/33", {
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }, "method": "GET"
            });
            expect(response).not.toBeFalsy();
            expect(response.cells).toHaveLength(2);
            expect(response.players).toHaveLength(2);
        });

        it('move tile', async () => {
            const response = await Engine.moveTile("1", {
                tileId: 1,
                coords: {q: 0, r: 0},
            });
            expect(response).not.toBeFalsy();
            expect(response.cells).toHaveLength(2);
            expect(response.players).toHaveLength(2);
        });

        it('calls onUpdate handler', () => {
            global.window.history.replaceState({gameId: 667}, document.title, `/game/667`);

            const handler = jest.fn();
            const { closeConnection} = Engine.connectGame("667", handler);
            expect(withUrl).toBeCalledWith('http://localhost/gamehub/667');
        })

        it('websocket', () => {
            const handler = jest.fn();
            const {closeConnection} = Engine.connectGame("1", handler);
            expect(hubConnection.stop).toBeCalled();
        })
    });
});
