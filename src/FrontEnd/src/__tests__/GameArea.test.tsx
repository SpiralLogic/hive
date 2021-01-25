import {CellDropEvent, useCellDropEmitter} from '../emitters';
import {GameState} from "../domain";
import {h} from 'preact';
import {render} from '@testing-library/preact';
import {renderElement, simulateEvent} from './helpers';
import Engine from '../game-engine';
import GameArea from '../components/GameArea';
import Hextille from '../components/Hextille';
import PlayerList from '../components/PlayerList';

jest.mock('../components/Hextille');
jest.mock('../components/PlayerList', () =>
    jest.fn(() => <div class="playerList"/>)
);
jest.mock('../game-engine');

const cellDropEvent: CellDropEvent = {
    move: {coords: {q: 1, r: 1}, tileId: 1},
    type: 'drop',
};
let gameState: GameState;
beforeEach(() => {
    const emptyCell = {coords: {q: 0, r: 0}, tiles: []};
    const player = {id: 2, name: 'Player 2', tiles: []};
    gameState = {gameId: "33", cells: [emptyCell], players: [player]};
    const gameAfterMove = {
        cells: [emptyCell, emptyCell],
        players: [player, player],
    };
    Engine.newGame = jest.fn().mockResolvedValue(gameState);
    Engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
});

test('shows loading', () => {
    const gameArea = renderElement(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);
    expect(gameArea).toMatchSnapshot();
});

test('shows game when loaded', async () => {
    const gameArea = render(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);
    expect(Hextille).toHaveBeenCalledTimes(1);
    expect(PlayerList).toHaveBeenCalledTimes(1);
});

test('default on drop is prevented', async () => {
    const gameArea = render(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);

    const preventDefault = simulateEvent(
        gameArea.container.firstElementChild as HTMLElement,
        'dragover'
    );
    expect(preventDefault).toHaveBeenCalled();
});

test('calls update game on cell drop', async () => {
    const gameArea = render(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);
    useCellDropEmitter().emit(cellDropEvent);

    expect(Engine.moveTile).toHaveBeenCalledTimes(1);
});

test('renders new state on cell drop', async () => {
    const gameArea = render(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea gameState={gameState} moveTile={Engine.moveTile}/>);

    useCellDropEmitter().emit(cellDropEvent);

    expect(Hextille).toHaveBeenCalledTimes(2);
    expect(PlayerList).toHaveBeenCalledTimes(2);
});
