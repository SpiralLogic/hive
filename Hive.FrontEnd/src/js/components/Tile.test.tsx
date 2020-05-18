import * as React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act, Simulate} from 'react-dom/test-utils';
import {create} from 'react-test-renderer';
import {Tile} from './Tile';
import {GameContext, HiveContext} from "../gameContext";

const mockContext = (): GameContext => ({
    getPlayerColor: jest.fn().mockReturnValueOnce('pink').mockReturnValueOnce('sky'),
    moveTile: jest.fn(),
    gameState: jest.genMockFromModule('../domain/gameState'),
});

const player1Tile = { id: 1, playerId: 1, content: 'ant', availableMoves: [{ q: 1, r: 1 }] };
const player2Tile = { id: 2, playerId: 2, content: 'fly', availableMoves: [] };

const tileJSX = () =>
    <HiveContext.Provider value={mockContext()}>
        <Tile key="1" {...player1Tile}/>
        <Tile key="2" {...player2Tile}/>
    </HiveContext.Provider>;

let container: HTMLDivElement;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    act(() => { render(tileJSX(), container);});
});

describe('Tile Render', () => {
    test('tile color is the player\'s color', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        expect(tiles[0].style.getPropertyValue('--color')).toBe('pink');
        expect(tiles[1].style.getPropertyValue('--color')).toBe('sky');
    });

    test('tile has content', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        expect(tiles[0].textContent).toBe('ant');
        expect(tiles[1].textContent).toBe('fly');
    });
});

describe('Tile drag and drop', () => {
    const attachCellToDom = (q: string, r: string) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset['coords'] = `${q},${r}`;
        document.body.appendChild(cell);
        return cell;
    };

    test('Tile is draggable when there are available moves', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        expect(tiles[0].attributes.getNamedItem('draggable')).toHaveProperty('value', 'true');
    });

    test('is *not* draggable when there are no moves available', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        expect(tiles[1].attributes.getNamedItem('draggable')).toHaveProperty('value', 'false');
    });

    test('on drag start available cells are given \'valid-cell\' class', () => {
        const availableCell = attachCellToDom('1', '1');
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        const mockDataTransfer = {setData: jest.fn().mockReturnValueOnce(2)};

        // @ts-ignore
        Simulate.dragStart(tiles[0], {dataTransfer: mockDataTransfer});

        expect(availableCell.classList).toContain('valid-cell');
    });

    test('on dragEnd cells have drag class removed', () => {
        const cell = attachCellToDom('1', '1');
        cell.classList.add('active', 'valid-cell', 'invalid-cell')

        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        Simulate.dragEnd(tiles[0]);

        expect(cell.classList).not.toContain('valid-cell');
        expect(cell.classList).not.toContain('invalid-cell');
        expect(cell.classList).not.toContain('active');
    });

    test('on drag unavailable cells don\'t have \'valid-cell\' class', () => {
        const unavailableCell = attachCellToDom('0', '0');
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        const mockDataTransfer = {setData: jest.fn().mockReturnValueOnce(2)};

        // @ts-ignore
        Simulate.dragStart(tiles[0], {dataTransfer: mockDataTransfer});

        expect(unavailableCell.classList).not.toContain('valid-cell');
    });
});

describe('Tile Snapshot', () => {
    test('matches current snapshot', () => {
        const component = create(tileJSX());

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
});