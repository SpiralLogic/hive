import * as React from 'react'
import { useDrop } from 'react-dnd'
import { IGameCoordinate, isValidMove, ITile } from '../domain'
import { Context } from '../GameContext'
import { TILE_TYPE } from './dragTypes'
import { Tile } from './Tile'

interface CellProps {
  color?: string,
  tiles: ITile[],
  coordinates: IGameCoordinate
}

export const Cell: React.FunctionComponent<CellProps> = ({
  color,
  tiles,
  coordinates,
}) => {
  const { styles } = React.useContext(Context)
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: TILE_TYPE,
    drop: () => coordinates,
    canDrop: (item, monitor) => {
      const { availableMoves: validDestinations } = monitor.getItem() as ITile
      return isValidMove(coordinates, validDestinations)
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <div className={styles.cell(color, coordinates, canDrop, isOver)} ref={drop}>
      {tiles.length > 0 && <Tile {...tiles[0]} />}
    </div>
  )
}
