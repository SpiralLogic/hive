import {Cell, HexCoordinates, Tile as TileType} from '../domain';
import {FunctionComponent, h} from 'preact';
import {TileDragEvent, useCellDropEmitter, useTileDragEmitter,} from '../emitters';
import {deepEqual} from 'fast-equals';
import {handleDragOver} from '../handlers';
import {memo} from 'preact/compat';
import {useEffect, useState} from 'preact/hooks';
import Tile from './Tile';

type Props = Cell;

const CellFC: FunctionComponent<Props> = (props: Props) => {
    const {tiles, coords} = props;
    const [tileDragEmitter, cellDropEmitter] = [
        useTileDragEmitter(),
        useCellDropEmitter(),
    ];
    const isValidMove = (validMoves: HexCoordinates[]) =>
        validMoves.some((dest) => deepEqual(coords, dest));
    const [classes, setClasses] = useState(['hex', 'cell']);
    const [currentTile, setCurrentTile] = useState<TileType | null>(null);

    function handleDragLeave(ev: { stopPropagation: () => void }) {
        ev.stopPropagation();
        if (currentTile)    setClasses(classes.filter(e => e !== 'active'))
    }

    function handleDragEnter(ev: { stopPropagation: () => void }) {
        ev.stopPropagation();
        if (currentTile) setClasses([...classes, 'active']);
    }

    function handleClickEvent(ev: { stopPropagation: () => void }) {
        if (currentTile) {
            setClasses([...classes, 'active']);
            tileDragEmitter.emit({type: 'end', tile: currentTile})
        }
    }

    const handleTileEvent = (e: TileDragEvent) => {
        const valid = isValidMove(e.tile.moves);
        if (e.type === 'start' && valid) {
            setClasses([...classes, 'can-drop']);
            setCurrentTile(e.tile)
        } else if (e.type === "start") {
            setCurrentTile(e.tile)
        } else if (e.type === 'end') {
            if (valid && currentTile && classes.includes('active'))
                cellDropEmitter.emit({
                    type: 'drop',
                    move: {coords, tileId: currentTile.id},
                });
            setCurrentTile(null);
            setClasses(['hex', 'cell']);
        }
    };

    useEffect(() => {
        tileDragEmitter.add(handleTileEvent);
        return () => tileDragEmitter.remove(handleTileEvent);
    });

    const attributes = {
        className: classes.join(' '),
        ondragover: handleDragOver,
        ondragleave: handleDragLeave,
        ondragenter: handleDragEnter,
        onmouseenter: handleDragEnter,
        onmouseleave: handleDragLeave,
        onclick: handleClickEvent,
    };

    return (
        <div {...attributes}>
            {tiles.length > 0 && <Tile {...tiles[0]} />}
        </div>
    );
};

CellFC.displayName = 'Cell';
export default memo(
    CellFC,
    (p, n) => deepEqual(p.coords, n.coords) && !p.tiles.length && !n.tiles.length
);
