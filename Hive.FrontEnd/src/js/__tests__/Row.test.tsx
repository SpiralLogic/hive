import * as React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import Row from '../components/Row';
import {Hexagon, HexCoordinates, Tile} from '../domain';
import {create} from 'react-test-renderer';

const cells: (Hexagon | false)[] = [{coordinates: {q: 0, r: 1}, tiles: [] as Tile[]}, {coordinates: {q: 1, r: 1}, tiles: [] as Tile[]}, false];
const rowJsx = <Row id={1} row={cells}/>;
let container: HTMLDivElement;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    render(rowJsx, container);
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

test('tile is memoized', () => {
    const first = React.createElement(Row, {id: 1, row: cells});
    const second = React.createElement(Row, {id: 1, row: cells});

    expect(first).toStrictEqual(second);
});

test('tile is re-rendered when cells have changed', () => {
    const first = React.createElement(Row, {id: 1, row: cells});
    const second = React.createElement(Row, {id: 1, row: cells.slice(1)});

    expect(first).not.toStrictEqual(second);
});

test('tile is re-rendered when cell tiles have changed', () => {
    const cell = {coordinates: {q: 0, r: 1}, tiles: [] as Tile[]};
    const first = React.createElement(Row, {id: 1, row: [cell]});

    const cell2 = {coordinates: {q: 0, r: 1}, tiles: [{id:1, playerId:1, content:'',availableMoves:[] as HexCoordinates[]}] };
    const second = React.createElement(Row, {id: 1, row: [cell2]});

    expect(first).not.toStrictEqual(second);
});

test('snapshot', () => {
    expect(create(rowJsx).toJSON()).toMatchSnapshot();
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
});