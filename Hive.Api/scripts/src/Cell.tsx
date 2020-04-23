import * as React from 'react';
import { useDrop } from 'react-dnd';
import { validMove } from './coordinateHelpers';
import { IGameCoordinate, ITile } from './domain';
import { TILE_TYPE } from './dragTypes';
import { Context } from './GameContext';
import { Tile } from './Tile';

interface CellProps {
  color?: string,
  tiles: ITile[],
  position: IGameCoordinate
}

export const Cell: React.FunctionComponent<CellProps> = ({
                                                           color,
                                                           tiles,
                                                           position,
                                                         }) => {
  const { styles } = React.useContext(Context);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: TILE_TYPE,
    drop: () => position,
    canDrop: (item, monitor) => {
      const { availableMoves: validDestinations } = monitor.getItem() as ITile;
      return validMove(position, validDestinations);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div className={styles.cell(color, position, canDrop, isOver)} ref={drop}>
      {tiles.length > 0 && <Tile {...tiles[0]} />}
    </div>
  );
};
