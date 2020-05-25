import { RenderResult, render, cleanup, fireEvent } from '@testing-library/preact';
import React from 'preact/compat';
import Tile from '../components/Tile';
import TileDragEmitter, { TileDragEvent } from '../emitter/tile-drag-emitter';
import * as CTX from '../game-context';
import { Fragment } from 'preact';

const player1Tile = { id: 1, playerId: 1, content: 'ant', availableMoves: [{ q: 1, r: 1 }] };
const player2Tile = { id: 2, playerId: 0, content: 'fly', availableMoves: [] };
let tileDragEmitter: TileDragEmitter;
let moveTileSpy = jest.fn();

const tileJSX = (tileDragEmitter: TileDragEmitter) => (
    <Fragment>
        <Tile key="1" {...player1Tile} tileDragEmitter={tileDragEmitter}/>
        <Tile key="2" {...player2Tile} tileDragEmitter={tileDragEmitter}/>
    </Fragment>
);

let container: RenderResult;

beforeEach(() => {
    moveTileSpy = jest.fn().mockImplementation(() => Promise.resolve({ players: [], hexagons: [] }));
    jest.spyOn(CTX, 'useHiveContext').mockImplementation(() => ({ moveTile: moveTileSpy, hexagons: [], players: [] }));
    tileDragEmitter = new TileDragEmitter();
    container = render(tileJSX(tileDragEmitter));
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

    function simulateEvent (target: HTMLElement, type: string) {
        const preventDefault = jest.fn();
        const e = new MouseEvent(type, {bubbles:true});
        Object.assign(e, {preventDefault});
        fireEvent(target, e);

        return preventDefault;
    }

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

        fireEvent.dragStart(tiles[0]);
        const expectedEvent: TileDragEvent = { type: 'start', tileId: player1Tile.id, tileMoves: player1Tile.availableMoves };

        expect(emitSpy).toHaveBeenCalledWith(expectedEvent);
    });

    test('on dragEnd emits end event', () => {
        const tiles = document.querySelectorAll<HTMLDivElement>('.tile');
        fireEvent.dragEnd(tiles[0]);
        const expectedEvent: TileDragEvent = { type: 'end', tileId: player1Tile.id, tileMoves: player1Tile.availableMoves };

        expect(emitSpy).toHaveBeenCalledWith(expectedEvent);
    });

    test('default on drop is prevented', () => {
        const tile = document.querySelectorAll<HTMLDivElement>('.tile')[1];
        const preventDefault = simulateEvent(tile, 'drop');

        expect(preventDefault).toHaveBeenCalled();
    });
});
describe('Tile Snapshot', () => {
    test('matches current snapshot', () => {
        expect(render(tileJSX(tileDragEmitter)).baseElement).toMatchSnapshot();
    });
});

afterEach(() => {
    cleanup();
});
