import {render} from '@testing-library/preact';
import {h} from 'preact';
import GameArea from 'hive/components/GameArea';
import Hextille from 'hive/components/Hextille';
import PlayerList from 'hive/components/PlayerList';
import {CellDropEvent, useCellDropEmitter} from 'hive/emitters';
import Engine from 'hive/game-engine';
import {renderElement, simulateEvent} from './helpers';

jest.mock('hive/components/Hextille',);
jest.mock('hive/components/PlayerList', () => jest.fn(() => <div class="playerList"/>));
jest.mock('hive/game-engine');

const cellDropEvent: CellDropEvent = {move: {coords: {q: 1, r: 1}, tileId: 1}, type: 'drop'};

beforeEach(() => {
    const emptyCell = {coordinates: {q: 0, r: 0}, tiles: []};
    const player = {id: 2, name: 'Player 2', availableTiles: []};
    const gameState = {cells: [emptyCell], players: [player]};
    const gameAfterMove = {cells: [emptyCell, emptyCell], players: [player, player]};
    Engine.newGame = jest.fn().mockResolvedValue(gameState);
    Engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
});

test('shows loading', () => {
    const gameArea = renderElement(<GameArea/>);
    expect(gameArea).toMatchSnapshot();
});

test('shows game when loaded', async () => {
    const gameArea = render(<GameArea/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea/>);
    expect(Hextille).toHaveBeenCalledTimes(1);
    expect(PlayerList).toHaveBeenCalledTimes(1);
});

test('default on drop is prevented', async () => {
    const gameArea = render(<GameArea/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea/>);

    const preventDefault = simulateEvent(gameArea.container.firstElementChild as HTMLElement, 'dragover');
    expect(preventDefault).toHaveBeenCalled();
});

test('calls update game on cell drop', async () => {
    const gameArea = render(<GameArea/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea/>);
    useCellDropEmitter().emit(cellDropEvent);

    expect(Engine.moveTile).toHaveBeenCalledTimes(1);
});

test('renders new state on cell drop', async () => {
    const gameArea = render(<GameArea/>);
    await Engine.newGame();
    gameArea.rerender(<GameArea/>);

    useCellDropEmitter().emit(cellDropEvent);

    expect(Hextille).toHaveBeenCalledTimes(2);
    expect(PlayerList).toHaveBeenCalledTimes(2);
});
