import { deepEqual } from 'fast-equals';
import { FunctionComponent, h } from 'preact';
import { memo, useState } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Cell, HexCoordinates } from '../domain';
import { useCellDropEmitter, useTileDragEmitter } from '../emitters';
import { TileDragEvent } from '../emitters/tile-drag-emitter';
import { handleDragOver } from '../handlers';
import Tile from './Tile';

type Props = Cell;

const CellFC: FunctionComponent<Props> = (props: Props) => {
    const { tiles, coords } = props;
    const [tileDragEmitter, cellDropEmitter] = [useTileDragEmitter(), useCellDropEmitter()];
    const isValidMove = (validMoves: HexCoordinates[]) => validMoves.some((dest) => deepEqual(coords, dest));
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
        const valid = isValidMove(e.moves);
        if (e.type === 'start' && valid) {
            setClasses(classes + ' can-drop');
        }

        if (e.type === 'end') {
            if (valid && classes.includes('active')) cellDropEmitter.emit({ type: 'drop', coords: coords, tileId: e.tileId });
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
};

CellFC.displayName = 'Cell';
export default memo(CellFC, (p, n) => deepEqual(p.coords, n.coords) && !p.tiles.length && !n.tiles.length);
