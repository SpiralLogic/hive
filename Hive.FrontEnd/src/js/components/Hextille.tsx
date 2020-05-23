import * as React from 'react';
import { Hexagon } from '../domain';
import { useHiveContext } from '../game-context';
import Row from './Row';

function getWidth(hexagons: Hexagon[]) {
    const [min, max] = hexagons.reduce(([min, max], c) => [Math.min(min, c.coordinates.q), Math.max(max, c.coordinates.q)], [0, 0]);
    return [min, max - min + 1];
}

function getHeight(sortedHexagons: Hexagon[]) {
    const firstRow = sortedHexagons[0].coordinates.r;
    const height = sortedHexagons[sortedHexagons.length - 1].coordinates.r - firstRow + 1;
    return [firstRow, height];
}

function createRows(sortedHexagons: Hexagon[]) {
    const [firstRow, height] = getHeight(sortedHexagons);
    const [firstColumn, width] = getWidth(sortedHexagons);

    const createEmptyRow = (i: number) => ({
        id: firstRow + i,
        row: new Array(width).fill(false),
    });

    const createEmptyRows = () => {
        return Array.from(Array(height).keys(), createEmptyRow);
    };

    return sortedHexagons.reduce((rows, hexagon) => {
        rows[hexagon.coordinates.r - firstRow].row[hexagon.coordinates.q - firstColumn] = hexagon;
        return rows;
    }, createEmptyRows());
}

function Hextille() {
    const { hexagons } = useHiveContext();
    const sortedHexagons = hexagons.sort((c1, c2) => c1.coordinates.r - c2.coordinates.r || c1.coordinates.q - c2.coordinates.q);
    const shiftClass = sortedHexagons[0].coordinates.r % 2 ? 'left' : 'right';
    const rows = createRows(sortedHexagons);

    return (
        <div className={'hextille ' + shiftClass}>
            {rows.map((row) => (
                <Row key={row.id} {...row} />
            ))}
        </div>
    );
}

Hextille.displayName = 'Hextille';

export default Hextille;
