import * as React from 'react';
import {Hexagon, HexCoordinates} from '../domain';
import CellMemo from './Cell';

const cellKey = ({q, r}: HexCoordinates) => `${q}-${r}`;
const cellComponent = (cell: Hexagon) => <CellMemo key={cellKey(cell.coordinates)} {...cell} />;
const emptyCell = (key: number) => <div key={key} className="hidden"/>;

type Props = {
    id: number;
    row: Array<Hexagon | false>;
};

function Row(props: Props) {
    const {row} = props;
    const cells = row.map((cell, i) => (cell && cellComponent(cell)) || emptyCell(i));
    return <div className="hex-row">{cells}</div>;
}

Row.displayName = 'Row';

function haveCellTilesBeenUpdated(prevProps: Props, newProps: Props) {
    return prevProps.row.every((cell, i) => newProps.row[i] && cell && (newProps.row[i] as Hexagon).tiles.length == (cell as Hexagon).tiles.length);
}

const RowMemo = React.memo(Row, (p, n) =>
    p.row.length == n.row.length &&
    haveCellTilesBeenUpdated(p, n));

export default RowMemo;
