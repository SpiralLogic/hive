import * as React from 'react';
import { HexCoordinates, PlayerId, TextContent, TileId } from '../domain';
import { tileDragEmitter } from '../gameContext';

export interface TileProps {
    id: TileId,
    content: TextContent
    playerId: PlayerId,
    availableMoves: HexCoordinates[],
}

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

export const Tile: React.FunctionComponent<TileProps> =
    ({
        id,
        playerId,
        content,
        availableMoves,
    }) => {
        function handleDragStart (ev: React.DragEvent<HTMLDivElement>) {
            tileDragEmitter.emit({ type: 'start', source: id, data: availableMoves });
        }

        function handleDragEnd (ev: React.DragEvent<HTMLDivElement>) {
            tileDragEmitter.emit({ type: 'end', source: id, data: availableMoves });
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

        return (
            <div {...attributes}>
                <span>{content}</span>
            </div>
        );
    };

Tile.displayName = 'Tile';