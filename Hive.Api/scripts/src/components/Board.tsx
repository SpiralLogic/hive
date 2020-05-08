import * as React from 'react';
import { Cell } from './Cell';
import { coordinateAsId, ICell } from '../domain';
import { Context } from '../GameContext';

export const Board: React.FunctionComponent = () => {
  const { allCells } = React.useContext(Context);
  const rows = allCells
    .sort((c1, c2) => c1.coordinates.q - c2.coordinates.q || c1.coordinates.r - c2.coordinates.r)
    .reduce((rows, cell) => {
      rows.has(cell.coordinates.q)
        ? rows.get(cell.coordinates.q)?.push(cell)
        : rows.set(cell.coordinates.q, [cell]);
      return rows;
    }, new Map<number, ICell[]>());

  return (
    <div className="board">
      <div>
        {Array.from(rows.values()).map((cells, index) => (
          <div key={index} className="hex-row">
            {cells.map(cell => (
              <Cell key={coordinateAsId(cell.coordinates)} {...cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};