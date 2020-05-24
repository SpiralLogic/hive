import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { create } from 'react-test-renderer';
import Row from '../components/Row';
import { HexCoordinates, Tile } from '../domain';

type RowProps = typeof Row.arguments.props['row'];
const cells: RowProps = [
    { coordinates: { q: 0, r: 1 }, tiles: [] as Tile[] },
    { coordinates: { q: 1, r: 1 }, tiles: [] as Tile[] },
    false
];

describe('Row test', () => {
    const rowJsx = (cells: RowProps) => <Row id={1} row={cells}/>;
    let container: HTMLDivElement;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        render(rowJsx(cells), container);
    });

    test('row has class', () => {
        const row = container.firstElementChild;

        expect(row?.classList).toContain('hex-row');
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
        expect(create(rowJsx(cells)).toJSON()).toMatchSnapshot();
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
    });
});
describe('memoize tests', () => {
    const required = require('../components/Row');
    const areEqualSpy = required.default.compare = jest.spyOn(required.default, 'compare');
    const Row = required.default;
    beforeEach(() => areEqualSpy.mockClear());

    test('row is memoize', () => {
        const container = create(<Row id={1} row={cells}/>);
        container.update(<Row id={1} row={cells}/>);
        expect(areEqualSpy).toHaveReturnedWith(true);
    });

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
    });
});
