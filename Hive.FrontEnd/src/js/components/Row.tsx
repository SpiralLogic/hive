import * as React from 'react';
import { Hexagon, HexCoordinates } from '../domain';
import Cell from './Cell';

type Props = {
    r: number,
    row: Array<Hexagon | false>
}
const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const cellComponent = (cell: Hexagon) => <Cell key={cellKey(cell.coordinates)} {...cell}/>;
const emptyCell = (key: number) => <div key={key} className='hidden'/>;

const Row = React.memo((props: Props) => {
    const { r, row } = props;
    return (
        <div className="hex-row">
            {row.map((cell, i) => cell !== false && cellComponent(cell) || emptyCell(i))}
        </div>
    );
}, ((p, n) =>  p.row.length == n.row.length && p.row.every((c, i) =>  (n.row[i] as Hexagon)?.tiles?.length == (c as Hexagon)?.tiles?.length)));

Row.displayName = 'Row';
export default Row;