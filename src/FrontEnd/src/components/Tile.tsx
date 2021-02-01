import { FunctionComponent, h } from 'preact';
import { JSXInternal } from 'preact/src/jsx';
import { PlayerId, Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop } from '../handlers';
import { memo } from 'preact/compat';
import { useTileEventEmitter } from '../emitters';

type Props = Tile;

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

const TileFC: FunctionComponent<Props> = (props: Props) => {
    const { moves, creature, playerId } = props;
    const tileEventEmitter = useTileEventEmitter();

    function handleDragStart () {
        tileEventEmitter.emit({ type: 'start', tile: props });
    }

    function handleDragEnd () {
        tileEventEmitter.emit({ type: 'end', tile: props });
    }

    const attributes = {
        title: creature,
        style: { '--color': getPlayerColor(playerId) } as JSXInternal.CSSProperties,
        class: 'hex tile',
        draggable: !!moves.length,
        ondrop: handleDrop
    };

    const handlers = attributes.draggable ? {
        onclick: handleDragStart,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
    } : {};

    const svg = `/svg/${creature.toLowerCase()}.svg`;

    return (
        <div {...attributes} {...handlers}>
            <object type="image/svg+xml" data={svg}>
                <img src={svg} alt={creature}/>
            </object>
        </div>
    );
};

TileFC.displayName = 'Tile';
export default memo(TileFC, deepEqual);
