import * as React from 'react';
import { Cell } from './Cell';
import { coordId } from './coordinateHelpers';
import { Context } from './GameContext';

export const Grid: React.FunctionComponent = () => {
  const { allCells } = React.useContext(Context);
  return (
    <>
      {allCells.map(cell => (
        <Cell key={coordId(cell.position)} {...cell} />
      ))}
    </>
  );
};

Grid.displayName = 'Grid';
