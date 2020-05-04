import * as React from 'react'
import { Cell } from './Cell'
import { coordinateAsId } from '../domain'
import { Context } from '../GameContext'

export const Board: React.FunctionComponent = () => {
  const { allCells } = React.useContext(Context)
  const rows = allCells.sort((c1, c2) => c1.coordinates.q - c2.coordinates.q)
  return (
    <div className="board">
      <div>
        <div className="hex-row">
          {allCells.map(cell => (
            <Cell key={coordinateAsId(cell.coordinates)} {...cell} />
          ))}
        </div>
      </div>
    </div>
  )
}
