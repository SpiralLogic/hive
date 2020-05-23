import * as React from 'react';
import { Hexagon, HexCoordinates } from '../domain';
import { tileDragEmitter, useHiveContext } from '../game-context';
import { TileDragEvent } from '../emitter/tile-drag-emitter';
import Tile from './Tile';

const defaultProps = {
    tileDragEmitter: tileDragEmitter,
};

type Props = Hexagon & typeof defaultProps;

const areEqual = (a: HexCoordinates, b: HexCoordinates) => a && b && a.q === b.q && a.r === b.r;

function handleDragOver(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    return false;
}

function handleDragLeave(ev: React.DragEvent<HTMLDivElement>) {
    ev.currentTarget.classList.remove('active', 'no-drop');
    ev.stopPropagation();
}

function handleDragEnter(ev: React.DragEvent<HTMLDivElement>) {
    const classList = ev.currentTarget.classList;
    classList.contains('can-drop') ? classList.add('active') : classList.add('no-drop');
    ev.stopPropagation();
}

function Cell(props: Props) {
    const { tiles, coordinates, tileDragEmitter } = props;
    const { moveTile } = useHiveContext();
    const cellRef = React.useRef<HTMLDivElement>(null);

    const isValidMove = (validMoves: HexCoordinates[]) => validMoves.some((dest) => areEqual(coordinates, dest));

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

    React.useEffect(() => {
        tileDragEmitter.add(canDrop);
        return () => tileDragEmitter.remove(canDrop);
    });

    return <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>;
}

Cell.displayName = 'Cell';
Cell.defaultProps = defaultProps;
const CellMemo = React.memo(Cell, (p, n) => p.coordinates.q == n.coordinates.r && p.coordinates.q == n.coordinates.q && p.tiles.length == n.tiles.length);

export default CellMemo;
