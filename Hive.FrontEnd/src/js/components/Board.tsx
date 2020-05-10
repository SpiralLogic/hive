import * as React from 'react';
import { Cell } from './Cell';
import { coordinateAsId, ICell } from '../domain';
import { Context } from '../GameContext';

type StyledCell = ICell | ICell & { hidden?: boolean };
type HextilleRow = StyledCell[];
const createOutOfBoundsCell = (q: number, r: number): StyledCell => ({
  coordinates: { q, r }, tiles: [], hidden: true
});

const createOutOfBoundsCells = (row: HextilleRow, [min, width]: number[]) => {
  return [...Array(width).keys()].map(i => row.find(c => c.coordinates.q == i + min) || createOutOfBoundsCell(i + min, row[0].coordinates.r));
};

const getHextilleWidthDimensions = (cells: StyledCell[]) => {
  const qCoords = cells.map(c => c.coordinates.q);
  const min = Math.min(...qCoords);
  const max = Math.max(...qCoords);

  return [min, max - min + 1];
};

export const Board: React.FunctionComponent = () => {
  const { allCells } = React.useContext(Context);
  const sortedCells = allCells.sort((c1, c2) => c1.coordinates.r - c2.coordinates.r || c1.coordinates.q - c2.coordinates.q);
  const firstRow = sortedCells[0].coordinates.r;
  const hextilleHeight = sortedCells[sortedCells.length - 1].coordinates.r - firstRow + 1;

  const rowCells = sortedCells.reduce((rows, cell) => {
    rows[cell.coordinates.r - firstRow].push(cell);
    return rows;
  }, Array.from(Array(hextilleHeight), () => new Array(0)));

  const widthDimensions = getHextilleWidthDimensions(sortedCells);
  const hextilleRows = rowCells.map(row => createOutOfBoundsCells(row, widthDimensions));
  const columnShift = { '--col-shift': (firstRow % 2) ? -1 : 1 };

  return (
    <div className="board" style={columnShift}>
      <div>
        {hextilleRows.map((cells, index) => (
          <div key={index} className="hex-row">
            {cells.map(cell => (
              <Cell key={coordinateAsId(cell.coordinates)} {...cell}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
;