import {FunctionComponent, h} from 'preact';
import {JSXInternal} from "preact/src/jsx";
import {PlayerId, Tile} from '../domain';
import {deepEqual} from 'fast-equals';
import {handleDrop} from '../handlers';
import {memo} from 'preact/compat';
import {useTileDragEmitter} from '../emitters';

type Props = Tile;

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

const TileFC: FunctionComponent<Props> = (props: Props) => {
    const {id, moves, creature, playerId} = props;
    const tileDragEmitter = useTileDragEmitter();

    function handleDragStart() {
        tileDragEmitter.emit({type: 'start', tile: props});
    }

    function handleDragEnd() {
        tileDragEmitter.emit({type: 'end', tile: props});
    }

    function handleClick() {
        tileDragEmitter.emit({type: 'end', tile: props});
        if (moves.length) tileDragEmitter.emit({type: 'start', tile: props});
    }

    const attributes = {
        title: creature,
        style: {'--color': getPlayerColor(playerId)} as JSXInternal.CSSProperties,
        class: 'hex tile',
        draggable: !!moves.length,
        ondrop: handleDrop,
    };

    const handlers = moves.length ? {
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        onclick: handleClick,
    } : {};


    return (
        <div {...attributes} {...handlers}>
            <span>{creature}</span>
        </div>
    );
};

TileFC.displayName = 'Tile';
export default memo(TileFC, deepEqual);
