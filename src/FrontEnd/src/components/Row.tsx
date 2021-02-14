import { FunctionComponent, h } from 'preact';
import { HexCoordinates } from '../domain';
import { deepEqual } from 'fast-equals';
import { memo } from 'preact/compat';
import Cell from './Cell';

type CellProps = typeof Cell.arguments['props'];
const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const createCell = (cell: CellProps, i: number) => <Cell x={i * 100} key={cellKey(cell.coords)} {...cell} />;

type Props = {
    id: number;
    row: Array<CellProps>;
};

const Row: FunctionComponent<Props> = (props: Props) => {
    const { row } = props;
    const cells = row.map((cell, i) => (cell && createCell(cell, i)));

    return <svg width={100 * cells.length} height="100" class="hex-row" xmlns="http://www.w3.org/2000/svg" viewBox={`"0 0 ${100 * cells.length} 100`}> {cells}</svg>;
};

Row.displayName = 'Row';
export default memo(Row, deepEqual);
