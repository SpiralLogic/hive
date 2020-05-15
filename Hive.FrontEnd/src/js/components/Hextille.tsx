import * as React from 'react';
import { Hexagon } from '../domain';
import { Row, RowProps } from './Row';
import { Context } from '../gameContext';

const getWidth = (hexagons: Hexagon[]) => {
    const [min, max] = hexagons.reduce(([min, max], c) =>
        [Math.min(min, c.coordinates.q), Math.max(max, c.coordinates.q)], [0, 0]);
    return [min, max - min + 1];
};

function getHeight (sortedHexagons: Hexagon[]) {
    const firstRow = sortedHexagons[0].coordinates.r;
    const height = sortedHexagons[sortedHexagons.length - 1].coordinates.r - firstRow + 1;
    return [firstRow, height];
}

const createEmptyRows = (height: number, width: number, firstRow: number) => {
    const createEmptyRow = (i: number) => ({ id: firstRow + i, row: new Array(width).fill(false) });
    return Array.from(Array(height).keys(), createEmptyRow);
};

export const Hextille: React.FunctionComponent = () => {
    const { hexagons } = React.useContext(Context).gameState;
    const sortedHexagons = hexagons.sort((c1, c2) => c1.coordinates.r - c2.coordinates.r || c1.coordinates.q - c2.coordinates.q);
    const [firstRow, height] = getHeight(sortedHexagons);
    const [firstColumn, width] = getWidth(sortedHexagons);
    const columnShift = { '--hex-offset': (firstRow % 2) ? -1 : 1 };
    const rowCells = sortedHexagons.reduce((rows, hexagon) => {
        rows[hexagon.coordinates.r-firstRow].row[hexagon.coordinates.q - firstColumn] = hexagon;
        return rows;
    }, createEmptyRows(height, width, firstRow)) as RowProps[];

    return (
        <div className="hextille" style={columnShift}>
            {rowCells.map((row) => (
                <Row key={row.id} {...row}/>
            ))}
        </div>
    );
};