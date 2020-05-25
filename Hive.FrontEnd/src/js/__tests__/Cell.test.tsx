import { render } from '@testing-library/preact';
import Cell from '../components/Cell';
import TileDragEmitter from '../emitter/tile-drag-emitter';
import { Fragment } from 'preact';
import React from 'preact/compat';

const cellWithNoTile = {
    coordinates: { q: 0, r: 0 },
    tiles: [],
    moveTile: jest.fn(),
};

const cellWithTile = {
    coordinates: { q: 1, r: 1 },
    tiles: [{ id: 2, playerId: 2, content: 'fly', availableMoves: [{ q: 0, r: 0 }] }],
    moveTile: jest.fn(),
};

const hexagonJSX = (tileDragEmitter: TileDragEmitter) => (
    <Fragment>
        <Cell key="0-0" {...cellWithNoTile} tileDragEmitter={tileDragEmitter}/>
        <Cell key="1-1" {...cellWithTile} tileDragEmitter={tileDragEmitter}/>
    </Fragment>
);
let container: HTMLDivElement;
let tileDragEmitter: TileDragEmitter;

beforeEach(() => {
    tileDragEmitter = new TileDragEmitter();
    container = document.createElement('div');
    document.body.appendChild(container);
        render(hexagonJSX(tileDragEmitter));
});

describe('Cell Render', () => {
    test('starts with default classes', () => {
        const hexagons = document.querySelectorAll<HTMLDivElement>('.cell');
        expect(hexagons[0].classList.toString()).toEqual('hex cell');
        expect(hexagons[1].classList.toString()).toEqual('hex cell');
    });

    test('top tile is rendered if it exists', () => {
        const cell = document.querySelectorAll<HTMLDivElement>('.cell')[1];
        const tile = document.querySelectorAll<HTMLDivElement>('.tile')[0];
        expect(cell.children).toContain(tile);
    });
});

describe('Cell drag and drop', () => {
    function emitTileEvent (type: 'start' | 'end') {
    //    TestUtils.act(() => {
    //        tileDragEmitter.emit({ type, tileId: 2, tileMoves: [{ q: 0, r: 0 }] });
   //     });
    }
    test('dragover allows drop', () => {
        const cell = document.querySelectorAll<HTMLDivElement>('.cell')[1];
        emitTileEvent('start');
        const preventDefault = jest.fn();
//        TestUtils.Simulate.dragOver(cell, { preventDefault });

        expect(preventDefault).toHaveBeenCalled();
    });

    test('cell is valid on drag start', () => {
        const cells = document.querySelectorAll<HTMLDivElement>('.cell');
        emitTileEvent('start');
//        cells.forEach((c) => TestUtils.Simulate.dragEnter(c));

        expect(cells[0].classList).toContain('can-drop');
    });

    test('valid cell is active on tile drag enter', () => {
        const cells = document.querySelectorAll<HTMLDivElement>('.cell');
        emitTileEvent('start');
//        cells.forEach((c) => TestUtils.Simulate.dragEnter(c));

        expect(cells[0].classList).toContain('active');
        expect(cells[0].classList).not.toContain('no-drop');
    });

    test('drop sends move tile request', () => {
        const cells = document.querySelectorAll<HTMLDivElement>('.cell');
        emitTileEvent('start');
//        cells.forEach((c) => TestUtils.Simulate.dragEnter(c));
        emitTileEvent('end');

        expect(cellWithNoTile.moveTile).toHaveBeenCalledWith({ tileId: 2, coordinates: { q: 0, r: 0 } });
    });

    test('invalid cell doesnt sent move request', () => {
        const cells = document.querySelectorAll<HTMLDivElement>('.cell');
//        cells.forEach((c) => TestUtils.Simulate.dragEnter(c));

        expect(cellWithTile.moveTile).not.toBeCalled();
    });

    test('active and invalid are removed on drag leave', () => {
        const cells = document.querySelectorAll<HTMLDivElement>('.cell');
        emitTileEvent('start');
//        cells.forEach((c) => TestUtils.Simulate.dragEnter(c));
//        cells.forEach((c) => TestUtils.Simulate.dragLeave(c));

        expect(Array.from(cells).flatMap((c) => c.classList)).not.toContain('active');
        expect(Array.from(cells).flatMap((c) => c.classList)).not.toContain('no-drop');
    });
});

describe('Cell Snapshot', () => {
    test('matches current snapshot', () => {

    });
});

afterEach(() => {
 //   unmountComponentAtNode(container);
    container.remove();
});
