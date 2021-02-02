import { Cell } from '../domain';
import { FunctionComponent, h } from 'preact';
import Row from './Row';

type Row = { id: number; row: Cell[] };

function getWidth (cells: Cell[]): [number, number] {
    const [min, max] = cells.reduce(
        ([min, max], c) => [Math.min(min, c.coords.q), Math.max(max, c.coords.q)],
        [0, 0]
    );
    return [min, max - min + 1];
}

function getHeight (sortedHexagons: Cell[]): [number, number] {
    const firstCell = sortedHexagons[0] as Cell;
    const lastCell = sortedHexagons[sortedHexagons.length - 1] as Cell;
    const height = lastCell.coords.r - firstCell.coords.r + 1;
    return [firstCell.coords.r, height];
}

function createRows (sortedHexagons: Cell[]) {
    const [firstRow, height] = getHeight(sortedHexagons);
    const [firstColumn, width] = getWidth(sortedHexagons);

    const createEmptyRow = (i: number): Row => ({
        id: firstRow + i,
        row: new Array(width).fill(false)
    });

    const createEmptyRows = () => {
        return Array.from(Array(height).keys(), createEmptyRow);
    };

    return sortedHexagons.reduce((rows, cell) => {
        (rows[cell.coords.r - firstRow] as Row).row[cell.coords.q - firstColumn] = cell;
        return rows;
    }, createEmptyRows());
}

type Props = { cells: Cell[] };

const Hextille: FunctionComponent<Props> = (props: Props) => {
    const { cells } = props;
    const sortedHexagons = cells.sort(
        (c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q
    );
    const shiftClass = sortedHexagons[0].coords.r % 2 ? 'left' : 'right';
    const rows = createRows(sortedHexagons);

    return (
        <div className="hex-container">
            <div className={'hextille ' + shiftClass}>
                {rows.map((row) => (
                    <Row key={row.id} {...row} />
                ))}
            </div>

        </div>
    );
};

Hextille.displayName = 'Hextille';
export default Hextille;
