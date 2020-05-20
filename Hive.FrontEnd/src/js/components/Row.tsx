import * as React from 'react';
import {Hexagon, HexCoordinates} from '../domain';
import {Cell} from './Cell';

type RowProps = {
    r: number,
    row: Array<Hexagon | false>
}
const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const cellComponent = (cell:Hexagon) => <Cell key={cellKey(cell.coordinates)}  {...cell}/>;
const emptyCell = (key:number) => <div key={key} className='hidden'/>;

const  Row: React.FunctionComponent<RowProps> = ({
    row,
}) => {
    return (
        <div className="hex-row">
            {row.map((cell,i) => cell !== false && cellComponent(cell) || emptyCell(i))}
        </div>
    );
};

Row.displayName = 'Row';
export default Row;