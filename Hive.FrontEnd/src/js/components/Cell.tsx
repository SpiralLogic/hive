import * as React from 'react';
import { Hexagon } from '../domain';
import { HiveContext } from '../gameContext';
import { Tile } from './Tile';

export type CellProps = Hexagon

function dragover_handler (ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    return false;
}

function dragleave_handler (ev: React.DragEvent<HTMLDivElement>) {
    ev.currentTarget.classList.remove('active', 'invalid-cell');
    ev.stopPropagation();
}

function dragenter_handler (ev: React.DragEvent<HTMLDivElement>) {
    ev.currentTarget.classList.contains('valid-cell')
        ? ev.currentTarget.classList.add('active')
        : ev.currentTarget.classList.add('invalid-cell');
    ev.stopPropagation();
}

export const Cell: React.FunctionComponent<CellProps> = ({
    tiles,
    coordinates,
}) => {
    const moveTile = React.useContext(HiveContext).moveTile;

    const attributes = {
        className: 'hex cell',
        'data-coords': coordinates.q + ',' + coordinates.r,
        onDragOver: dragover_handler,
        onDrop: drop_handler,
        onDragLeave: dragleave_handler,
        onDragEnter: dragenter_handler,
    };

    function drop_handler (ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
        if (ev.currentTarget as HTMLDivElement && ev.currentTarget.classList.contains('valid-cell')) {
            const tileId = parseInt(ev.dataTransfer.getData('hex-tile'));
            moveTile({ coordinates, tileId });
        }
    }

    return (
        <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>
    );
};

Cell.displayName = 'Cell';