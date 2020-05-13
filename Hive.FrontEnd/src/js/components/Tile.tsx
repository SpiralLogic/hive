import * as React from 'react';
import { useDrag } from 'react-dnd';
import { HexCoordinates, PlayerId, TextContent, TileId } from '../domain';
import { Context } from '../gameContext';

interface TileProps {
    id: TileId,
    content: TextContent
    playerId: PlayerId,
    availableMoves: HexCoordinates[],
}

export const TILE_TYPE = Symbol();

export const Tile: React.FunctionComponent<TileProps> = ({
    id,
    playerId,
    content,
    availableMoves,
}) => {
    const { getPlayerColor, moveTile } = React.useContext(Context);
    const [, drag] = useDrag({
        item: { type: TILE_TYPE, id, availableMoves, playerId },
        end: (item, monitor) => {
            if (monitor.didDrop()) {
                const { q, r } = monitor.getDropResult();
                moveTile({ tileId: id, coordinates: { q, r } });
            }
        },
        canDrag: () => availableMoves.length > 0,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const style = { '--color': getPlayerColor(playerId) };

    return (
        <div key={id} ref={drag} className="hex tile" title={content} style={style}>
            <span>{content}</span>
        </div>
    );
};
