import { deepEqual } from 'fast-equals';
import { h } from 'preact';
import { memo, useState } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Hexagon, HexCoordinates } from '../domain';
import { useCellDropEmitter } from '../emitters/cell-drop-emitter';
import { TileDragEvent, useTileDragEmitter } from '../emitters/tile-drag-emitter';
import { handleDragOver } from '../handlers';
import Tile from './Tile';

const defaultProps = {
    tileDragEmitter: useTileDragEmitter(),
    cellDropEmitter: useCellDropEmitter(),
};

type Props = Hexagon & typeof defaultProps;

function Cell(props: Props) {
    const { tiles, coordinates, tileDragEmitter, cellDropEmitter } = props;
    const isValidMove = (validMoves: HexCoordinates[]) => validMoves.some((dest) => deepEqual(coordinates, dest));
    const [classes, setClasses] = useState('hex cell');

    function handleDragLeave(ev: { stopPropagation: () => void }) {
        ev.stopPropagation();
        setClasses(classes.replace(' active', ''));
    }

    function handleDragEnter(ev: { stopPropagation: () => void }) {
        ev.stopPropagation();
        setClasses(classes + ' active');
    }

    const handleTileEvent = (e: TileDragEvent) => {
        const valid = isValidMove(e.tileMoves);
        if (e.type === 'start' && valid) {
            setClasses(classes + ' can-drop');
        }

        if (e.type === 'end') {
            if (valid && classes.includes('active'))
                cellDropEmitter.emit({ type: 'drop', coordinates, tileId: e.tileId });
            setClasses('hex cell');
        }
    };

    useEffect(() => {
        tileDragEmitter.add(handleTileEvent);
        return () => tileDragEmitter.remove(handleTileEvent);
    });

    const attributes = {
        className: classes,
        ondragover: handleDragOver,
        ondragleave: handleDragLeave,
        ondragenter: handleDragEnter,
    };

    return <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>;
}

Cell.displayName = 'Cell';
Cell.defaultProps = defaultProps;

export default memo(Cell, (p, n) => deepEqual(p.coordinates, n.coordinates) && !p.tiles.length && !n.tiles.length);
