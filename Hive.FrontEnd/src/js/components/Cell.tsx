import * as React from 'react';
import {Hexagon, HexCoordinates} from '../domain';
import { HiveContext, tileDragEmitter } from '../gameContext';
import {Tile} from './Tile';
import {useEffect, useRef} from 'react';
import {TileDragEvent} from '../emitter/tileDragEmitter';

type CellProps = Hexagon

function handleDragOver(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    return false;
}

function handleDragLeave(ev: React.DragEvent<HTMLDivElement>) {
    ev.currentTarget.classList.remove('active', 'invalid-cell');
    ev.stopPropagation();
}

function handleDragEnter(ev: React.DragEvent<HTMLDivElement>) {
    const classList = ev.currentTarget.classList;
    classList.contains('valid-cell') ? classList.add('active') : classList.add('invalid-cell');
    ev.stopPropagation();
}

const areEqual = (a: HexCoordinates, b: HexCoordinates) => a && b && a.q === b.q && a.r === b.r;

export const Cell: React.FunctionComponent<CellProps> =
    ({tiles, coordinates,}) => {
        const {moveTile} = React.useContext(HiveContext);
        const cellRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            tileDragEmitter.add(canDrop);
            return () => tileDragEmitter.remove(canDrop);
        });
        const isValidMove = (validMoves: HexCoordinates[]) => validMoves.some(dest => areEqual(coordinates, dest));

        const canDrop = (e: TileDragEvent) => {
            const cellNode = cellRef.current;
            if (!cellNode) return;
            
            if (e.type === 'start' && isValidMove(e.data)) {
                cellNode.classList.add('valid-cell');
                return;
            }
            if (e.type === 'end' && cellNode.classList.contains('active')) {
                moveTile({coordinates, tileId: e.source});
            }
            cellNode.classList.remove('invalid-cell', 'valid-cell', 'active');
        };

        const attributes = {
            ref: cellRef,
            className: 'hex cell',
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDragEnter: handleDragEnter,
        };

        return (
            <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>
        );
    }
;

Cell.displayName = 'Cell';

export default Cell;