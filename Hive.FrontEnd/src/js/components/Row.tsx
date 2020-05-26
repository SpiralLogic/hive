import {memo} from 'preact/compat';
import {Hexagon, HexCoordinates} from '../domain';
import Cell from './Cell';
import React from 'preact/compat';
import {deepEqual} from 'fast-equals';

const cellKey = ({q, r}: HexCoordinates) => `${q}-${r}`;
const createCell = (cell: typeof Cell.arguments['props']) => <Cell key={cellKey(cell.coordinates)} {...cell} />;
const createPlaceholder = (key: number) => <div key={key} className="hidden"/>;

type Props = {
    id: number;
    row: Array<Hexagon | false>;
};

function Row(props: Props) {
    const {row} = props;
    const cells = row.map((cell, i) => (cell && createCell(cell)) || createPlaceholder(i));

    return <div className="hex-row">{cells}</div>;
}

Row.displayName = 'Row';
const RowMemo = memo(Row, deepEqual);

export default RowMemo;
