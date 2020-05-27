import { h } from 'preact';
import { memo } from 'preact/compat';
import { HexCoordinates, PlayerId, TileContent, TileId } from '../domain';
import { handleDrop } from '../handlers';
import { useTileDragEmitter } from '../emitter/tile-drag-emitter';
import { deepEqual } from 'fast-equals';

const defaultProps = {
    tileDragEmitter: useTileDragEmitter(),
};

type Props = {
    id: TileId;
    content: TileContent;
    playerId: PlayerId;
    availableMoves: HexCoordinates[];
} & typeof defaultProps;

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

function Tile (props: Props) {
    const { id, availableMoves, content, playerId, tileDragEmitter } = props;

    function handleDragStart () {
        tileDragEmitter.emit({ type: 'start', tileId: id, tileMoves: availableMoves });
    }

    function handleDragEnd () {
        tileDragEmitter.emit({ type: 'end', tileId: id, tileMoves: availableMoves });
    }

    const attributes = {
        title: content,
        style: { '--color': getPlayerColor(playerId) },
        className: 'hex tile',
        draggable: !!availableMoves.length,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        ondrop: handleDrop,
    };

    return (
        <div {...attributes}>
            <span>{content}</span>
        </div>
    );
}

Tile.displayName = 'Tile';
Tile.defaultProps = defaultProps;

export default memo(Tile, deepEqual);
