import {GameState} from "../domain";
import {h} from 'preact';
import {render} from "@testing-library/preact";
import {renderElement, simulateEvent} from './helpers';
import App from "../components/App";
import Engine from "../game-engine";
import GameArea from "../components/GameArea";

jest.mock('../game-engine');
jest.mock('../components/GameArea');
describe('App', () => {
    let gameState: GameState;
    beforeEach(() => {
        global.window.history.replaceState({}, global.document.title, `/`);
        const emptyCell = {coords: {q: 0, r: 0}, tiles: []};
        const player = {id: 2, name: 'Player 2', tiles: []};
        gameState = {gameId: "33", cells: [emptyCell], players: [player]};
        const gameAfterMove = {
            cells: [emptyCell, emptyCell],
            players: [player, player],
        };
        Engine.newGame = jest.fn().mockResolvedValue(gameState);
        Engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
        Engine.connectGame = jest.fn().mockReturnValue({closeConnection:jest.fn()});
    });

    test('shows loading', () => {
        const app = renderElement(<App/>);
        expect(app).toMatchSnapshot();
    });

    test('shows game when loaded', async () => {
        const app = render(<App/>);
        await Engine.newGame();
        expect(GameArea).toHaveBeenCalledTimes(1);
    });

    test('connects to server', async () => {
        const app = render(<App/>);
        await Engine.newGame();
        app.rerender(<App/>);
        expect(Engine.connectGame).toHaveBeenCalledTimes(1);
    });
});
