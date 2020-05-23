import * as React from 'react';
import { Hexagon, HexCoordinates } from '../domain';
import Cell from './Cell';

type Props = {
    id: number;
    row: Array<Hexagon | false>;
};

const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const cellComponent = (cell: Hexagon) => <Cell key={cellKey(cell.coordinates)} {...cell} />;
const emptyCell = (key: number) => <div key={key} className="hidden" />;

function Row(props: Props) {
    const { row } = props;
    const cells = row.map((cell, i) => (cell && cellComponent(cell)) || emptyCell(i));
    return <div className="hex-row">{cells}</div>;
}

Row.displayName = 'Row';
export default React.memo(
    Row,
    (p, n) => p.row.length == n.row.length && p.row.every((c, i) => (n.row[i] as Hexagon)?.tiles?.length == (c as Hexagon)?.tiles?.length),
);
