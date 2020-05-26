import {useState, memo} from 'preact/compat';
import React from 'preact/compat';
import {Hexagon, HexCoordinates, MoveTile} from '../domain';
import {TileDragEvent, useEmitter} from '../emitter/tile-drag-emitter';
import {handleDragOver} from '../handlers';
import Tile from './Tile';
import {deepEqual} from 'fast-equals';

const defaultProps = {
    tileDragEmitter: useEmitter(),
};

type Props = Hexagon & { moveTile: MoveTile } & typeof defaultProps;
    
function Cell(props: Props) {
    const {tiles, coordinates, tileDragEmitter, moveTile} = props;
    const isValidMove = (validMoves: HexCoordinates[]) => validMoves.some((dest) => deepEqual(coordinates, dest));
    const [classes, setClasses] = useState('hex cell');

    function handleDragLeave(ev: { stopPropagation: () => void; }) {
        ev.stopPropagation();
        setClasses(classes.replace(' active', ''));
    }

    function handleDragEnter(ev: { stopPropagation: () => void; }) {
        ev.stopPropagation();
        setClasses(classes + ' active');
    }

    const canDrop = (e: TileDragEvent) => {
        const valid = isValidMove(e.tileMoves);
        if (e.type === 'start' && valid) {
            setClasses(classes + ' can-drop');
        }

        if (e.type === 'end') {
            valid && classes.includes('active') && moveTile({coordinates, tileId: e.tileId});
            setClasses('hex cell');
        }
    };

    React.useEffect(() => {
        tileDragEmitter.add(canDrop);
        return () => tileDragEmitter.remove(canDrop);
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
const CellMemo = memo(Cell, (p, n) => deepEqual(p.coordinates, n.coordinates) && !p.tiles.length && !n.tiles.length);

export default CellMemo;
