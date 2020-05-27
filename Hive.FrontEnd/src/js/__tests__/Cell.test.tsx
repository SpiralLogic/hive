import { act, fireEvent, render } from '@testing-library/preact';
import Cell from '../components/Cell';
import { h } from 'preact';
import { useCellDropEmitter } from '../emitter/cell-drop-emitter';
import { useTileDragEmitter } from '../emitter/tile-drag-emitter';
import { deepEqual } from 'fast-equals';
import { simulateEvent } from './helpers/helpers';

jest.mock('fast-equals', () => ({ deepEqual: jest.fn(() => true) }));

const moveTileSpy = jest.fn();

const cellWithNoTile = () => {
    const cell = { coordinates: { q: 0, r: 0 }, tiles: [], moveTile: moveTileSpy };
    return render(<Cell {...cell}/>).container.firstElementChild as HTMLElement;
};

const cellWithTile = () => {
    const tile = { id: 2, playerId: 2, content: 'fly', availableMoves: [] };
    const cell = { coordinates: { q: 1, r: 1 }, tiles: [tile], moveTile: moveTileSpy };

    return render(<Cell {...cell}/>).container.firstElementChild as HTMLElement;
};

const canDropCellWithTile = () => {
    const tile = { id: 2, playerId: 2, content: 'ant', availableMoves: [] };
    const cell = { coordinates: { q: 2, r: 2 }, tiles: [tile], moveTile: moveTileSpy };

    return render(<Cell {...cell}/>).container.firstElementChild as HTMLElement;
};

const noDropEmptyCell = () => {
    const cell = { coordinates: { q: 0, r: 0 }, tiles: [], moveTile: moveTileSpy };
    return render(<Cell {...cell}/>).container.firstElementChild as HTMLElement;
};

const canDropEmptyCell = cellWithNoTile;
const noDropCellWithTile = cellWithTile;

describe('Cell Render', () => {
    test('starts with default classes', () => {
        expect(cellWithTile().classList.value).toEqual('hex cell');
        expect(cellWithNoTile().classList.value).toEqual('hex cell');
    });

    test('top tile is rendered if it exists', () => {
        const tiles = cellWithTile().getElementsByClassName('tile');
        expect(tiles).toHaveLength(1);
    });

    test('Cell is memoized with deep equal', () => {
        const props = { coordinates: { q: 0, r: 0 }, tiles: [], moveTile: moveTileSpy };
        const cell = <Cell {...props}/>;
        render(cell).rerender(cell);
        expect(deepEqual).toHaveBeenCalledTimes(1);
    });
});

describe('Cell drag and drop', () => {
    const emitter = useTileDragEmitter();

    function emitTileEvent (type: 'start' | 'end') {
        act(() => emitter.emit({ type, tileId: 2, tileMoves: [{ q: 0, r: 0 }, { q: 2, r: 2 }] }));
    }

    test('dragover allows drop', () => {
        const preventDefault = simulateEvent(cellWithTile(), 'dragover');

        expect(preventDefault).toHaveBeenCalled();
    });

    test('cell is valid on drag start', () => {
        const cellWithTile = canDropCellWithTile();
        const emptyCell = canDropEmptyCell();
        emitTileEvent('start');

        expect(cellWithTile).toHaveClass('can-drop');
        expect(emptyCell).toHaveClass('can-drop');
    });

    test('valid cell is active on tile drag enter', () => {
        const cellWithTile = canDropCellWithTile();
        const emptyCell = canDropEmptyCell();
        emitTileEvent('start');
        fireEvent.dragEnter(cellWithTile);
        fireEvent.dragEnter(emptyCell);

        expect(cellWithTile).toHaveClass('active');
        expect(emptyCell).toHaveClass('active');
    });

    test('drop sends move tile request when valid and active', () => {
        jest.spyOn(useCellDropEmitter(), 'emit');
        const cellWithTile = canDropCellWithTile();
        const emptyCell = canDropEmptyCell();
        emitTileEvent('start');
        fireEvent.dragEnter(cellWithTile);
        fireEvent.dragEnter(emptyCell);
        emitTileEvent('end');

        expect(useCellDropEmitter().emit).toHaveBeenCalledWith({ type: 'drop', tileId: 2, coordinates: { q: 0, r: 0 } });
        expect(useCellDropEmitter().emit).toHaveBeenCalledWith({type: 'drop', tileId: 2, coordinates: { q: 2, r: 2 } });
    });

    test('drop doesnt send move tile request when cell is no drop', () => {
        jest.spyOn(useCellDropEmitter(), 'emit');
        noDropCellWithTile();
        noDropEmptyCell();
        emitTileEvent('start');
        emitTileEvent('end');

        expect(useCellDropEmitter().emit).not.toHaveBeenCalled();
    });

    test('invalid cell doesnt send move request', () => {
        noDropCellWithTile();
        noDropEmptyCell();
        document.querySelectorAll('.cell').forEach(c => fireEvent.dragEnter(c));

        expect(moveTileSpy).not.toHaveBeenCalled();
    });

    test('active and no-drop are removed on drag leave', () => {
        cellWithTile();
        cellWithNoTile();
        noDropCellWithTile();
        noDropEmptyCell();
        emitTileEvent('start');
        document.querySelectorAll('.cell').forEach(c => fireEvent.dragEnter(c));
        document.querySelectorAll('.cell').forEach(c => fireEvent.dragLeave(c));

        expect(document.getElementsByClassName('active')).toHaveLength(0);
        expect(document.getElementsByClassName('no-drop')).toHaveLength(0);
    });
});

describe('Cell Snapshot', () => {
    test('cell with tile matches current snapshot', () => {
        expect(cellWithTile()).toMatchSnapshot();
    });

    test('cell with no tile matches current snapshot', () => {
        expect(cellWithNoTile()).toMatchSnapshot();
    });
});
