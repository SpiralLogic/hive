import {FunctionComponent, h} from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import {PlayerId, Tile} from '../domain';
import {deepEqual} from 'fast-equals';
import {handleDrop} from '../handlers';
import {memo} from 'preact/compat';
import {useTileEventEmitter} from '../emitters';

type Props = Tile;

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

const TileFC: FunctionComponent<Props> = (props: Props) => {
    const {moves, creature, playerId} = props;
    const tileEventEmitter = useTileEventEmitter();

    function handleDragStart() {
        tileEventEmitter.emit({type: 'start', tile: props});
    }

    function handleClick(ev: { stopPropagation: () => void }) {
        ev.stopPropagation();
        tileEventEmitter.emit({type: 'start', tile: props});
    }

    function handleDragEnd() {
        tileEventEmitter.emit({type: 'end', tile: props});
    }

    const attributes = {
        title: creature,
        style: {'--color': getPlayerColor(playerId)} as JSXInternal.CSSProperties,
        class: 'hex tile',
        draggable: !!moves.length,
        ondrop: handleDrop
    };

    const handlers = attributes.draggable ? {
        onclick: handleClick,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
    } : {};

    return (
        <div {...attributes} {...handlers}>
            <svg xmlns="http://www.w3.org/2000/svg">
                <use href={`/svg/creatures.svg#${creature.toLowerCase()}`}></use>
            </svg>
        </div>
    );
};

TileFC.displayName = 'Tile';
export default memo(TileFC, deepEqual);
