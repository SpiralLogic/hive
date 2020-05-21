import * as React from 'react';
import {HexCoordinates, PlayerId, TextContent, TileId} from '../domain';
import {HiveContext} from '../gameContext';

export interface TileProps {
    id: TileId,
    content: TextContent
    playerId: PlayerId,
    availableMoves: HexCoordinates[],
}

export const TILE_TYPE = Symbol();

export const Tile: React.FunctionComponent<TileProps> =
    ({
        id,
        playerId,
        content,
        availableMoves,
    }) => {
        const {getPlayerColor, tileDragEmitter} = React.useContext(HiveContext);

        function onDragStart(ev: React.DragEvent<HTMLDivElement>) {
            tileDragEmitter.emit({type: 'start', source: id, data: availableMoves});
        }

        function onDragEnd(ev: React.DragEvent<HTMLDivElement>) {
            tileDragEmitter.emit({type: 'end', source: id, data: availableMoves});
        }

        const attributes = {
            title: content,
            style: {'--color': getPlayerColor(playerId)},
            className: 'hex tile',
            draggable: !!availableMoves.length,
            onDragStart: onDragStart,
            onDragEnd: onDragEnd,
            onDrop: (ev: React.DragEvent<HTMLDivElement>) => {ev.preventDefault();return false;}
        };

        return (
            <div {...attributes}>
                <span>{content}</span>
            </div>
        );
    };

Tile.displayName = 'Tile';