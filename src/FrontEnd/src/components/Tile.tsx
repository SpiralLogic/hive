import {FunctionComponent, h} from 'preact';
import {JSXInternal} from "preact/src/jsx";
import {PlayerId, Tile} from '../domain';
import {deepEqual} from 'fast-equals';
import {handleDrop} from '../handlers';
import {memo} from 'preact/compat';
import {useState} from "preact/hooks";
import {useTileDragEmitter} from '../emitters';

type Props = Tile;

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

const TileFC: FunctionComponent<Props> = (props: Props) => {
    const {id, moves, creature, playerId} = props;
    const tileDragEmitter = useTileDragEmitter();
    const [isClicked, setIsClicked] = useState(false);

    function handleDragStart() {
        setIsClicked(true);
        tileDragEmitter.emit({type: 'start', tile: props});
    }

    function handleDragEnd() {
        setIsClicked(false);
        tileDragEmitter.emit({type: 'end', tile: props});
    }

    const attributes = {
        title: creature,
        style: {'--color': getPlayerColor(playerId)} as JSXInternal.CSSProperties,
        class: 'hex tile',
        draggable: !!moves.length,
    };

    const handlers = moves.length ? {
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        onclick: isClicked ? handleDragEnd : handleDragStart,
        ondrop: handleDrop,
    } : {};


    return (
        <div {...attributes} {...handlers}>
            <span>{creature}</span>
        </div>
    );
};

TileFC.displayName = 'Tile';
export default memo(TileFC, deepEqual);
