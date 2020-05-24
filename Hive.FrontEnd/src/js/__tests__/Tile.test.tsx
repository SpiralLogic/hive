import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { create } from 'react-test-renderer';
import Tile from '../components/Tile';
import TileDragEmitter, { TileDragEvent } from '../emitter/tile-drag-emitter';
import * as TestUtils from 'react-dom/test-utils';
import * as CTX from '../game-context';

const player1Tile = { id: 1, playerId: 1, content: 'ant', availableMoves: [{ q: 1, r: 1 }] };
const player2Tile = { id: 2, playerId: 0, content: 'fly', availableMoves: [] };
let tileDragEmitter: TileDragEmitter;
let moveTileSpy = jest.fn();

const tileJSX = (tileDragEmitter: TileDragEmitter) => (
    <>
        <Tile key="1" {...player1Tile} tileDragEmitter={tileDragEmitter} />
        <Tile key="2" {...player2Tile} tileDragEmitter={tileDragEmitter} />
    </>
);

let container: HTMLDivElement;

beforeEach(() => {
    moveTileSpy = jest.fn().mockImplementation(() => Promise.resolve({ players: [], hexagons: [] }));
    jest.spyOn(CTX, 'useHiveContext').mockImplementation(() => ({ moveTile: moveTileSpy, hexagons: [], players: [] }));
    tileDragEmitter = new TileDragEmitter();
    container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
        render(tileJSX(tileDragEmitter), container);
    });
});

describe('Tile Render', () => {
    test('tile color is the player\'s color', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        expect(tiles[0].style.getPropertyValue('--color')).toBe('#f64c72');
        expect(tiles[1].style.getPropertyValue('--color')).toBe('#85dcbc');
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
        tileDragEmitter.add(emitSpy);
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
        TestUtils.act(() => Simulate.dragStart(tiles[0]));

        const expectedEvent: TileDragEvent = { type: 'start', tileId: player1Tile.id, tileMoves: player1Tile.availableMoves };

        expect(emitSpy).toHaveBeenCalledWith(expectedEvent);
    });

    test('on dragEnd emits end event', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        TestUtils.act(() => Simulate.dragEnd(tiles[0]));
        const expectedEvent: TileDragEvent = { type: 'end', tileId: player1Tile.id, tileMoves: player1Tile.availableMoves };

        expect(emitSpy).toHaveBeenCalledWith(expectedEvent);
    });

    test('default on drop is prevented', () => {
        const tile = document.querySelectorAll<HTMLDivElement>('.tile')[1];
        const preventDefault = jest.fn();
        TestUtils.Simulate.drop(tile, { preventDefault });

        expect(preventDefault).toHaveBeenCalled();
    });
});

describe('Tile Snapshot', () => {
    test('matches current snapshot', () => {
        const component = create(tileJSX(tileDragEmitter));

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
});
