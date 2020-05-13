import * as React from 'react';
import { Hexagon, HexCoordinates } from '../domain';
import { Cell } from './Cell';

export type RowProps = {
    id: string | number,
    row: Array<Hexagon|false>
}
const cellComponent = (cell: Hexagon) => <Cell   {...cell}/>;
const emptyCell = (id: string) => <div key={'b'+id} className={'hidden'}/>;

export const Row: React.FunctionComponent<RowProps> = ({
    id,
    row,
}) => {
    return (
        <div className="hex-row">
            {row.map((cell, q) => cell!==false && cellComponent(cell) || emptyCell(id + ' ' + q))}
        </div>
    );
};

Row.displayName = 'Row';