import * as React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act, Simulate} from 'react-dom/test-utils';
import {create} from 'react-test-renderer';
import {GameContext, HiveContext} from '../gameContext';
import TileDragEmitter from '../emitter/tileDragEmitter';
import * as TestUtils from 'react-dom/test-utils';
import {Tile} from '../components';

const mockContext = (): GameContext => ({
    getPlayerColor: jest.fn().mockReturnValueOnce('pink').mockReturnValueOnce('sky'),
    moveTile: jest.fn(),
    players: jest.genMockFromModule('../domain/gameState'),
    hexagons: jest.genMockFromModule('../domain/gameState'),
    tileDragEmitter: new TileDragEmitter()
});

const player1Tile = {id: 1, playerId: 1, content: 'ant', availableMoves: [{q: 1, r: 1}]};
const player2Tile = {id: 2, playerId: 2, content: 'fly', availableMoves: []};
let context: GameContext;

const tileJSX = (context: GameContext) =>
    <HiveContext.Provider value={context}>
        <Tile key="1" {...player1Tile}/>
        <Tile key="2" {...player2Tile}/>
    </HiveContext.Provider>;

let container: HTMLDivElement;

beforeEach(() => {
    context = mockContext();
    container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
        render(tileJSX(context), container);
    });
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
    const emitSpy = jest.fn();
    beforeEach(() => {
        emitSpy.mockClear();
        context.tileDragEmitter.add(emitSpy);

    });
    
    test('Tile is draggable when there are available moves', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        expect(tiles[0].attributes.getNamedItem('draggable')).toHaveProperty('value', 'true');
    });

    test('is *not* draggable when there are no moves available', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        expect(tiles[1].attributes.getNamedItem('draggable')).toHaveProperty('value', 'false');
    });

    test('on drag emits start event', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        Simulate.dragStart(tiles[0]);

        const expectedEvent = {type: 'start', source: player1Tile.id, data: player1Tile.availableMoves};

        expect(emitSpy).toBeCalledWith(expectedEvent);
    });

    test('on dragEnd emits end event', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        Simulate.dragEnd(tiles[0]);
        const expectedEvent = {type: 'end', source: player1Tile.id, data: player1Tile.availableMoves};

        expect(emitSpy).toBeCalledWith(expectedEvent);
    });

    test('default on drop is prevented', () => {
        const tile = document.querySelectorAll<HTMLDivElement>('.tile')[1];
        const preventDefault = jest.fn();
        TestUtils.Simulate.drop(tile, {preventDefault});

        expect(preventDefault).toBeCalled();
    });
});

describe('Tile Snapshot', () => {
    test('matches current snapshot', () => {
        const component = create(tileJSX(context));

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
});