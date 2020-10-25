import { deepEqual } from 'fast-equals';
import { FunctionComponent, h } from 'preact';
import { memo } from 'preact/compat';
import { HexCoordinates } from '../domain';
import Cell from './Cell';

type CellProps = typeof Cell.arguments['props'];
const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const createCell = (cell: CellProps) => <Cell key={cellKey(cell.coords)} {...cell} />;
const createPlaceholder = (key: number) => <div key={key} className="hidden" />;

type Props = {
    id: number;
    row: Array<CellProps>;
};

const Row: FunctionComponent<Props> = (props: Props) => {
    const { row } = props;
    const cells = row.map((cell, i) => (cell && createCell(cell)) || createPlaceholder(i));

    return <div className="hex-row">{cells}</div>;
};

Row.displayName = 'Row';
export default memo(Row, deepEqual);
