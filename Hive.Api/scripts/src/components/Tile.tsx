import * as React from 'react';
import { useDrag } from 'react-dnd';
import { Color, IGameCoordinate, PlayerId, TileContent, TileId } from './domain';
import { TILE_TYPE } from './dragTypes';
import { Context } from './GameContext';
import log from './logger';

const TileContent: React.FunctionComponent<{
  content?: TileContent;
  className: string;
}> = ({ content, className }) => {
  if (!content) {
    return null;
  }

  switch (content.type) {
  case 'image':
    return <img className={className} src={content.url}/>;

  case 'react':
    const Component = content.component;
    return <Component/>;

  case 'text':
    return <span>{content.text}</span>;

  default:
    log.error('Unknown content type passed to cell', content);
    return null;
  }
};

const useDefaults = (color: Color | undefined, owner: PlayerId) => {
  const { gameState } = React.useContext(Context);
  if (color) {
    return color;
  }
  const player = gameState.players.find(p => p.id === owner);

  return player ? player.color : '#fff';
};

interface TileProps {
  color?: Color,
  playerId: PlayerId,
  id: TileId,
  availableMoves: IGameCoordinate[],
  content?: TileContent
}

export const Tile: React.FunctionComponent<TileProps> = ({
  color,
  playerId,
  id,
  content,
  availableMoves,
}) => {
  const safeColor = useDefaults(color, playerId);
  const { styles, moveTile } = React.useContext(Context);
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
  return (
    <div ref={drag} className={styles.tile(safeColor, availableMoves.length > 0, isDragging)} title={id}>
      <TileContent content={content} className={styles.tileImage}/>
    </div>
  );
};


