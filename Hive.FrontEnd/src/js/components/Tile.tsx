import { CSSProperties } from 'react';
import * as React from 'react';
import { useDrag } from 'react-dnd';
import { IGameCoordinate, ITextContent, PlayerId, TileContent, TileId } from '../domain';
import { Context, getPlayerColor } from '../GameContext';

const TileContent: React.FunctionComponent<{
  content?: TileContent;
}> = ({ content }) => {
    if (!content) {
        return null;
    }

    switch (content.type) {
    case 'text':
        return <span>{content.text}</span>;

    default:
        console.error('Unknown content type passed to cell', content);
        return null;
    }
};

interface TileProps {
  id: TileId,
  playerId: PlayerId,
  availableMoves: IGameCoordinate[],
  content: TileContent
}

export const TILE_TYPE = Symbol();

export const Tile: React.FunctionComponent<TileProps> = ({
    id,
    playerId,
    content,
    availableMoves,
}) => {
    const { gameState, moveTile } = React.useContext(Context);
    const [{ isDragging }, drag] = useDrag({
        item: { type: TILE_TYPE, id, availableMoves, playerId },
        end: (item, monitor) => {
            if (monitor.didDrop()) {
                const { q, r } = monitor.getDropResult() as IGameCoordinate;
                moveTile({ tileId: id, coordinates: { q, r } });
            }
        },
        canDrag: () => availableMoves.length > 0,

        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} className="hex tile" title={content.text} style={{ '--color': getPlayerColor(playerId) }}>
            <TileContent content={content}/>
        </div>
    );
};
