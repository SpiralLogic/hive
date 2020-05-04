import * as React from 'react';
import { Tile } from './Tile';
import { IPlayer } from '../domain';

export const Player: React.FunctionComponent<IPlayer> = ({ name, color, availableTiles }) => {
  return (
    <div className="player" title={name} >
        {availableTiles.map(tile => (
            <Tile {...tile}  />
        ))}
    </div>
  );
};
