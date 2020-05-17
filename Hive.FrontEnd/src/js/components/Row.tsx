import * as React from 'react';
import { HexCoordinates } from '../domain';
import { Cell, CellProps } from './Cell';

export type RowProps = {
    id: number,
    row: Array<CellProps | false>,
    shift: string,
}
const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;

const cellComponent = (cell: CellProps) => <Cell key={cellKey(cell.coordinates)}  {...cell}/>;
const emptyCell = (id: number) => <div key={id} className={'hidden'}/>;

export const Row: React.FunctionComponent<RowProps> = ({
    id,
    row,
}) => {
    return (
        <div className="hex-row">
            {row.map((cell, q) => cell !== false && cellComponent(cell) || emptyCell(id + q))}
        </div>
    );
};

Row.displayName = 'Row';