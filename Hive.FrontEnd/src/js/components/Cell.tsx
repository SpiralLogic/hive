import { useState } from 'react';
import * as React from 'react';
import * as isEqual from 'react-fast-compare';
import { Hexagon, HexCoordinates, MoveTile } from '../domain';
import { TileDragEvent } from '../emitter/tile-drag-emitter';
import { handleDragOver } from '../handlers';
import Tile, { tileDragEmitter } from './Tile';

const defaultProps = {
    tileDragEmitter: tileDragEmitter,
};

type Props = Hexagon & { moveTile: MoveTile } & typeof defaultProps;

function Cell (props: Props) {
    const { tiles, coordinates, tileDragEmitter, moveTile } = props;
    const isValidMove = (validMoves: HexCoordinates[]) => validMoves.some((dest) => isEqual(coordinates, dest));
    const [classes, setClasses] = useState('hex cell');

    function handleDragLeave (ev: React.DragEvent<HTMLDivElement>) {
        ev.stopPropagation();
        setClasses(classes.replace(' active', ''));
    }

    function handleDragEnter (ev: React.DragEvent<HTMLDivElement>) {
        ev.stopPropagation();
        setClasses(classes + ' active');
    }

    const canDrop = (e: TileDragEvent) => {
        const valid = isValidMove(e.tileMoves);
        if (e.type === 'start' && valid) {
            setClasses(classes + ' can-drop');
        }

        if (e.type === 'end') {
            valid && classes.includes('active') && moveTile({ coordinates, tileId: e.tileId });
            setClasses('hex cell');
        }
    };

    React.useEffect(() => {
        tileDragEmitter.add(canDrop);
        return () => tileDragEmitter.remove(canDrop);
    });

    const attributes = {
        className: classes,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDragEnter: handleDragEnter,
    };

    return <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>;
}

Cell.displayName = 'Cell';
Cell.defaultProps = defaultProps;
const CellMemo = React.memo(Cell, (prevProps, nextProps) => isEqual(prevProps.coordinates, nextProps.coordinates) && !prevProps.tiles.length && !nextProps.tiles.length);

export default CellMemo;
