import * as React from 'react';
import { Cell } from './Cell';
import { coordinateAsId, ICell } from '../domain';
import { Context } from '../GameContext';

type StyledCell = ICell | ICell & { hidden?: boolean };
type RowLimit = [number, number, number];
const createOutOfBoundsCell = (q: number, r: number): StyledCell => ({
  coordinates: { q, r }, tiles: [], hidden: true
});
const createOutOfBoundsCells = (row: StyledCell[], [min, max, maxWidth]: RowLimit, [rowMin, rowMax, rowWidth]: RowLimit) => {

  return [...Array(maxWidth).keys()].map(i => row.find(c => c.coordinates.q == i + min) || createOutOfBoundsCell(i + min, row[0].coordinates.r));
};

const limitFinder = (range: number[]): RowLimit => {
  const e = [Math.min(...range), Math.max(...range)];
  return [e[0], e[1], e[1] - e[0] + 1];
};

export const Board: React.FunctionComponent = () => {
  const { allCells } = React.useContext(Context);
  const rows = Array.from(allCells
    .sort((c1, c2) => c1.coordinates.r - c2.coordinates.r || c1.coordinates.q - c2.coordinates.q)
    .reduce((rows, cell) => {
      rows.has(cell.coordinates.r) ? rows.get(cell.coordinates.r)?.push(cell) : rows.set(cell.coordinates.r, [cell]);
      return rows;
    }, new Map<number, StyledCell[]>()).values());

  const rowLimits = rows.map(r => r.map(c => c.coordinates.q)).map(limitFinder);
  const limits: RowLimit = [Math.min(...rowLimits.map(r => r[0])), Math.max(...rowLimits.map(r => r[1])), Math.max(...rowLimits.map(r => r[2]))];
  const newRows = rows.map((r, i) => createOutOfBoundsCells(r, limits, rowLimits[i]));
  const rowShift = { '--row-shift': (newRows[0][0].coordinates.r % 2) ? -1 : 1 };
  return (
    <div className="board" style={rowShift}>
      <div>
        {newRows.map((cells, index) => (
          <div key={index} className="hex-row">
            {cells.map(cell => (
              <Cell key={coordinateAsId(cell.coordinates)} {...cell}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};