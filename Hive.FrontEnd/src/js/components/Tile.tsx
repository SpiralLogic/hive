import * as React from 'react';
import { HexCoordinates, PlayerId, TextContent, TileId } from '../domain';
import { tileDragEmitter } from '../gameContext';
import Cell from './Cell';

type Props = {
    id: TileId,
    content: TextContent
    playerId: PlayerId,
    availableMoves: HexCoordinates[],
} & typeof defaultProps;
const defaultProps = {
    tileDragEmitter: tileDragEmitter
};

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

function Tile (props: Props) {
    const { id, availableMoves, content, playerId, tileDragEmitter } = props;

    function handleDragStart (ev: React.DragEvent<HTMLDivElement>) {
        tileDragEmitter.emit({ type: 'start', tileId: id, tileMoves: availableMoves });
    }

    function handleDragEnd (ev: React.DragEvent<HTMLDivElement>) {
        tileDragEmitter.emit({ type: 'end', tileId: id, tileMoves: availableMoves });
    }

    function handleDrop (ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
        return false;
    }

    const attributes = {
        title: content,
        style: { '--color': getPlayerColor(playerId) },
        className: 'hex tile',
        draggable: !!availableMoves.length,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onDrop: handleDrop
    };

    return <div {...attributes}><span>{content}</span></div>;
}

Tile.displayName = 'Tile';
Tile.defaultProps = defaultProps;

React.memo(Tile, ((p, n) => p.id == n.id && p.availableMoves.length == n.availableMoves.length));

export default Tile;