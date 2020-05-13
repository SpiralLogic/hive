import * as React from 'react';
import { coordinateAsId, ICell } from '../domain';
import { Context } from '../GameContext';
import { Cell } from './Cell';

const getHextilleWidthDimensions = (cells: ICell[]) => {
    const [min, max] = cells
        .reduce(([min, max], c) => [Math.min(min, c.coordinates.q), Math.max(max, c.coordinates.q)], [0, 0]);

    return [min, max - min + 1];
};
export const Board: React.FunctionComponent = () => {
    const { allCells } = React.useContext(Context);
    const sortedCells = allCells.sort((c1, c2) => c1.coordinates.r - c2.coordinates.r || c1.coordinates.q - c2.coordinates.q);
    const firstRow = sortedCells[0].coordinates.r;
    const height = sortedCells[sortedCells.length - 1].coordinates.r - firstRow + 1;
    const [minQ, width] = getHextilleWidthDimensions(sortedCells);
    const columnShift = { '--hex-offset': (firstRow % 2) ? -1 : 1 };

    const rowCells = sortedCells.reduce((rows, cell) => {
        rows[cell.coordinates.r - firstRow][cell.coordinates.q - minQ] = cell;
        return rows;
    }, Array.from(Array(height), () => new Array(width).fill(false)));

    return (
        <div className="board" style={columnShift}>
            {rowCells.map((cells, r) => (
                <div key={r} className="hex-row">
                    {cells.map((cell, q) =>
                        cell ? <Cell key={coordinateAsId(cell.coordinates)} {...cell}/> :
                            <div key={q + ' ' + r} className={'hidden'}/>)}
                </div>
            ))}
        </div>
    );
};