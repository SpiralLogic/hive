import Row from '../components/Row'
import { Tile } from '../domain';
import { cleanup, render, RenderResult } from '@testing-library/preact';
import React from 'preact';

type RowProps = typeof Row.arguments.props['row'];

describe('Row test', () => {

    const cells: RowProps = [
        { coordinates: { q: 0, r: 1 }, tiles: [] as Tile[] },
        { coordinates: { q: 1, r: 1 }, tiles: [] as Tile[] },
        false
    ];

    const rowJsx = (cells: RowProps) => <Row id={1} row={cells}/>;
    let container: RenderResult;
    beforeEach(() => {
        container = render(rowJsx(cells));
    });

    test('row has class', () => {
        expect(container.baseElement.classList).toContain('hex-row');
    });

    test('row renders multiple cells', () => {
        const cells = document.querySelectorAll('.hex-row > div');
        expect(cells).toHaveLength(3);
    });

    test('row renders hidden div for missing cells', () => {
        const hiddenCell = document.querySelectorAll('.hidden');

        expect(hiddenCell).toHaveLength(1);
    });
    test('snapshot', () => {
        expect(render(rowJsx(cells)).asFragment()).toMatchSnapshot();
    });

    afterEach(() => {
        cleanup();
    });
});
describe('memoize tests', () => {
    const cells: RowProps = [
        { coordinates: { q: 0, r: 1 }, tiles: [] as Tile[] },
        { coordinates: { q: 1, r: 1 }, tiles: [] as Tile[] },
        false
    ];

    test('row is memoize', () => {
        const s = jest.fn(Row);
        const container = render(<Row id={1} row={cells}/>);
        container.rerender(<Row id={1} row={cells}/>);
        expect(s).toHaveReturnedWith(true);
    });
    /*
        test('row is re-rendered when cells have changed', () => {
            const container = create(<Row id={1} row={cells}/>);
            container.update(<Row id={1} row={cells.slice(1, 2)}/>);
            expect(areEqualSpy).toHaveReturnedWith(false);
        });
        test('tile is re-rendered when cell tiles have changed', () => {
            const cell = { coordinates: { q: 0, r: 1 }, tiles: [] as Tile[] };
            const container = create(<Row id={1} row={[cell]}/>);

            const cell2 = { coordinates: { q: 0, r: 1 }, tiles: [] as Tile[] };
            cell.tiles.push({ id: 1, playerId: 1, content: '', availableMoves: [] as HexCoordinates[] });

            container.update(<Row id={1} row={[cell2]}/>);

            expect(areEqualSpy).toHaveReturnedWith(false);
        });*/
});
