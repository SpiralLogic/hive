import {render, RenderResult} from '@testing-library/preact';
import Row from '../components/Row';
import { h } from 'preact';
import {deepEqual} from 'fast-equals';

jest.mock('fast-equals');

type RowProps = typeof Row.arguments.props['row'];

const cells: RowProps = [
    {coordinates: {q: 0, r: 1}, tiles: []},
    {coordinates: {q: 1, r: 1}, tiles: []},
    false
];

const rowJsx = (cells: RowProps) => <Row id={1} row={cells}/>;
let container: RenderResult;

describe('Row test', () => {
    beforeEach(() => {
        container = render(rowJsx(cells));
    });

    test('row has class', () => {
        const row = document.querySelectorAll('.hex-row');
        expect(row).toHaveLength(1);
    });

    test('row renders multiple cells', () => {
        const cells = document.querySelectorAll('.hex-row > div');
        expect(cells).toHaveLength(3);
    });

    test('row renders hidden div for missing cells', () => {
        const hiddenCell = document.querySelectorAll('.hidden');
        expect(hiddenCell).toHaveLength(1);
    });

    test('Row is memoized with deep equal', () => {
        const props = {id: 1, row: []};
        const row = <Row {...props} />;
        render(row).rerender(row);
        expect(deepEqual).toHaveBeenCalledTimes(1);
    });

    test('snapshot', () => {
        expect(container.baseElement).toMatchSnapshot();
    });
});
