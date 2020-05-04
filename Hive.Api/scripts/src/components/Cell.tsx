import * as React from 'react'
import { useDrop } from 'react-dnd'
import { IGameCoordinate, ITile } from '../domain'
import { Tile, TILE_TYPE } from './Tile'

interface CellProps {
  color?: string,
  tiles: ITile[],
  coordinates: IGameCoordinate
}

const areEqual = (a: IGameCoordinate, b: IGameCoordinate) => {
  return a && b && a.q === b.q && a.r === b.r
}

const isValidMove = (move: IGameCoordinate, validMoves: IGameCoordinate[]) => {
  return validMoves.some(dest => areEqual(move, dest))
}

export const Cell: React.FunctionComponent<CellProps> = ({
  tiles,
  coordinates,
}) => {
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
  
  const className = 'cell' + (isOver && canDrop ?  ' active' : isOver ? ' inactive' : '')

  return (
    <div className={className} ref={drop}>
      {tiles.length > 0 && <Tile {...tiles[0]} />}
    </div>
  )
}
