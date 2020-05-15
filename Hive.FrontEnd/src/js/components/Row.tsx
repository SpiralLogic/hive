import * as React from 'react';
import { Hexagon, HexCoordinates } from '../domain';
import { Cell } from './Cell';

export type RowProps = {
    id: number,
    row: Array<Hexagon | false>
}
const coordinateToString = ({ q, r }: HexCoordinates) => `${q}-${r}`;

const cellComponent = (cell: Hexagon) => <Cell key={coordinateToString(cell.coordinates)}  {...cell}/>;
const emptyCell = (id: string) => <div key={'b' + id} className={'hidden'}/>;

export const Row: React.FunctionComponent<RowProps> = ({
    id,
    row,
}) => {
    return (
        <div className="hex-row">
            {row.map((cell, q) => cell !== false && cellComponent(cell) || emptyCell(coordinateToString({q,r:id})))}
        </div>
    );
};

Row.displayName = 'Row';