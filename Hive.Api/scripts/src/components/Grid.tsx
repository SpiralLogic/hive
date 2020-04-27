import * as React from 'react';
import { Cell } from './Cell';
import { Context } from './GameContext';
import { coordinateAsId } from './domain'

export const Grid: React.FunctionComponent = () => {
  const { allCells } = React.useContext(Context);
  return (
    <>
      {allCells.map(cell => (
        <Cell key={coordinateAsId(cell.coordinates)} {...cell} />
      ))}
    </>
  );
};

Grid.displayName = 'Grid';
