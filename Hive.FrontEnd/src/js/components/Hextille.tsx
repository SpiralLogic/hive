import * as React from 'react';
import {Hexagon} from '../domain';
import Row from './Row';

const getWidth = (hexagons: Hexagon[]) => {
    const [min, max] = hexagons.reduce(([min, max], c) =>
        [Math.min(min, c.coordinates.q), Math.max(max, c.coordinates.q)], [0, 0]);
    return [min, max - min + 1];
};

function getHeight(sortedHexagons: Hexagon[]) {
    const firstRow = sortedHexagons[0].coordinates.r;
    const height = sortedHexagons[sortedHexagons.length - 1].coordinates.r - firstRow + 1;
    return [firstRow, height];
}


function createRows(sortedHexagons: Hexagon[]) {
    const [firstRow, height] = getHeight(sortedHexagons);
    const [firstColumn, width] = getWidth(sortedHexagons);

    const createEmptyRows = () => {
        const createEmptyRow = (i: number) => ({
            r: firstRow + i,
            row: new Array(width).fill(false),
            firstColumn
        });
        return Array.from(Array(height).keys(), createEmptyRow);
    };

    return sortedHexagons.reduce((rows, hexagon) => {
        rows[hexagon.coordinates.r - firstRow].row[hexagon.coordinates.q - firstColumn] = hexagon;
        return rows;
    }, createEmptyRows());
}

export const Hextille: React.FunctionComponent<{ hexagons: Hexagon[] }> = ({hexagons}) => {

    if (!hexagons.length) throw Error('Nothing to render !');
    const sortedHexagons = hexagons.sort((c1, c2) => c1.coordinates.r - c2.coordinates.r || c1.coordinates.q - c2.coordinates.q);
    const shiftClass = (sortedHexagons[0].coordinates.r % 2) ? 'left' : 'right';
    const rows = createRows(sortedHexagons);

    return (
        <div className={'hextille ' + shiftClass}>
            {rows.map((row) => (
                <Row key={row.r} {...row} />
            ))}
        </div>
    );
};

Hextille.displayName = 'Hextille';