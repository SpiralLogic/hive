import { FunctionComponent, h } from 'preact';
import { Cell } from '../domain';
import Row from './Row';

function getWidth(cells: Cell[]) {
    const [min, max] = cells.reduce(([min, max], c) => [Math.min(min, c.coords.q), Math.max(max, c.coords.q)], [0, 0]);
    return [min, max - min + 1];
}

function getHeight(sortedHexagons: Cell[]) {
    const firstRow = sortedHexagons[0].coords.r;
    const height = sortedHexagons[sortedHexagons.length - 1].coords.r - firstRow + 1;
    return [firstRow, height];
}

function createRows(sortedHexagons: Cell[]) {
    const [firstRow, height] = getHeight(sortedHexagons);
    const [firstColumn, width] = getWidth(sortedHexagons);

    const createEmptyRow = (i: number) => ({
        id: firstRow + i,
        row: new Array(width).fill(false),
    });

    const createEmptyRows = () => {
        return Array.from(Array(height).keys(), createEmptyRow);
    };

    return sortedHexagons.reduce((rows, cell) => {
        rows[cell.coords.r - firstRow].row[cell.coords.q - firstColumn] = cell;
        return rows;
    }, createEmptyRows());
}

type Props = { cells: Cell[] };

const Hextille: FunctionComponent<Props> = (props: Props) => {
    const { cells } = props;
    const sortedHexagons = cells.sort((c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q);
    const shiftClass = sortedHexagons[0].coords.r % 2 ? 'left' : 'right';
    const rows = createRows(sortedHexagons);

    return (
        <div className={'hextille ' + shiftClass}>
            {rows.map((row) => (
                <Row key={row.id} {...row} />
            ))}
        </div>
    );
};

Hextille.displayName = 'Hextille';
export default Hextille;
