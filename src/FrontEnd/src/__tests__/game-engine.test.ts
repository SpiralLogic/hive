/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HubConnectionState } from '@microsoft/signalr';
import Engine from '../game-engine';
import gameState from './fixtures/gameState.json';

jest.mock('@microsoft/signalr');

describe('GameEngine', () => {
    const signalR = require('@microsoft/signalr');

    const createHubConnection = (state: HubConnectionState) => ({
        start: jest.fn().mockResolvedValue(true),
        on: jest.fn().mockResolvedValue(true),
        stop: jest.fn().mockResolvedValue(true),
        off: jest.fn().mockResolvedValue(true),
        onreconnecting: jest.fn(),
        onreconnected: jest.fn(),
        onclose: jest.fn(),
        state: state,
    });

    let hubConnection: ReturnType<typeof createHubConnection>;
    const signalRWithUrlMock = jest.fn().mockReturnThis();
    const builder = jest.fn().mockImplementation(() => (
        {
            withUrl: signalRWithUrlMock,
            withAutomaticReconnect: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue(hubConnection),
        }));

    beforeEach(function () {
        // eslint-disable-next-line no-undef
        global.fetch = jest.fn().mockImplementation(() => ({ ok: true, json: jest.fn().mockResolvedValue(gameState) }));

        hubConnection = createHubConnection(HubConnectionState.Connected);

        signalR.HubConnection = jest.fn(() => hubConnection);

        signalR.HubConnectionBuilder = builder;
    });

    describe('Game Engine', () => {
        it('new game', async () => {
            const response = await Engine.newGame();
            expect(response).not.toBeFalsy();
            expect(response.cells).toHaveLength(2);
            expect(response.players).toHaveLength(2);
        });

        it('existing game', async () => {
            const response = await Engine.getGame('33');
            expect(global.fetch).toBeCalledWith('/api/game/33', {
                'headers': {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, 'method': 'GET'
            });
            expect(response).not.toBeFalsy();
            expect(response.cells).toHaveLength(2);
            expect(response.players).toHaveLength(2);
        });

        it('move tile', async () => {
            const response = await Engine.moveTile('1', {
                tileId: 1,
                coords: { q: 0, r: 0 },
            });
            expect(response).not.toBeFalsy();
            expect(response.cells).toHaveLength(2);
            expect(response.players).toHaveLength(2);
        });

        it(`connectGame connections to hub for game id`, async () => {
            global.window.history.replaceState({ gameId: 667 }, document.title, `/game/667`);

            const handler = jest.fn();
            const { getConnectionState } = Engine.connectGame('667', handler);
            await getConnectionState();
            expect(signalRWithUrlMock).toBeCalledWith('http://localhost/gamehub/667');
        });

        it(`web socket connection state can be retrieved`, async () => {
            const handler = jest.fn();
            const { getConnectionState } = Engine.connectGame('33', handler);
            await getConnectionState();
            expect(hubConnection.start).toBeCalled();
        });

        it(`web socket connection can be closed`, async () => {
            const handler = jest.fn();
            const { getConnectionState, closeConnection } = Engine.connectGame('33', handler);
            await getConnectionState();
            await closeConnection();
            expect(hubConnection.off).toBeCalledTimes(1);
            expect(hubConnection.stop).toBeCalledTimes(1);
        });

        it(`connection state is disconnected initially`, async () => {
            const handler = jest.fn();
            hubConnection = createHubConnection(HubConnectionState.Disconnected);
            signalR.HubConnection = jest.fn(() => hubConnection);
            const { getConnectionState } = Engine.connectGame('33', handler);
            expect(getConnectionState()).toBe(HubConnectionState.Disconnected);
        });

        it(`connection has connected state`, async () => {
            const handler = jest.fn();
            const { getConnectionState, closeConnection } = Engine.connectGame('33', handler);
            await closeConnection();
            expect(getConnectionState()).toBe(HubConnectionState.Connected);
        });
    });
});
