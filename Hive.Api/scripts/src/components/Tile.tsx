import { CSSProperties } from 'react';
import * as React from 'react';
import { useDrag } from 'react-dnd';
import { IGameCoordinate, ITextContent, PlayerId, TileContent, TileId } from '../domain';
import { Context } from '../GameContext';

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
        const position = monitor.getDropResult() as IGameCoordinate;
        moveTile({ tileId: id, coordinates: position });
      }
    },
    canDrag: () => availableMoves.length > 0,

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const player = gameState.players.find(p => p.id === playerId);
  const styles = { '--color': player ? player.color : 'black' } as CSSProperties;
  
  return (
    <div ref={drag} className="cell tile" title={content as ITextContent && content.text} style={styles}>
      <TileContent content={content}/>
    </div>
  );
};
