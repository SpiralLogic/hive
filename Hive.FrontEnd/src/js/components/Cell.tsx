import * as React from 'react';
import { Hexagon, HexCoordinates } from '../domain';
import { tileDragEmitter, useGameContext } from '../gameContext';
import { useEffect, useRef } from 'react';
import { TileDragEvent } from '../emitter/tileDragEmitter';
import Tile from './Tile';

type Props = Hexagon & typeof defaultProps;
const defaultProps = {
    tileDragEmitter: tileDragEmitter
};
const areEqual = (a: HexCoordinates, b: HexCoordinates) => a && b && a.q === b.q && a.r === b.r;

function Cell (props: Props) {
    const { tiles, coordinates, tileDragEmitter } = props;
    const { moveTile } = useGameContext();
    const cellRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        tileDragEmitter.add(canDrop);
        return () => tileDragEmitter.remove(canDrop);
    });
    const isValidMove = (validMoves: HexCoordinates[]) => validMoves.some(dest => areEqual(coordinates, dest));

    const canDrop = (e: TileDragEvent) => {
        const cellNode = cellRef.current;
        if (!cellNode) return;

        if (e.type === 'start' && isValidMove(e.tileMoves)) {
            cellNode.classList.add('can-drop');
            return;
        }
        if (e.type === 'end' && cellNode.classList.contains('active')) {
            moveTile({ coordinates, tileId: e.tileId });
        }
        cellNode.classList.remove('no-drop', 'can-drop', 'active');
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

function handleDragOver (ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    return false;
}

function handleDragLeave (ev: React.DragEvent<HTMLDivElement>) {
    ev.currentTarget.classList.remove('active', 'no-drop');
    ev.stopPropagation();
}

function handleDragEnter (ev: React.DragEvent<HTMLDivElement>) {
    const classList = ev.currentTarget.classList;
    classList.contains('can-drop') ? classList.add('active') : classList.add('no-drop');
    ev.stopPropagation();
}

Cell.displayName = 'Cell';
Cell.defaultProps = defaultProps;
React.memo(Cell, (p, n) => p.coordinates.q == n.coordinates.r && p.coordinates.q == n.coordinates.q && p.tiles.length == n.tiles.length);
export default Cell;

