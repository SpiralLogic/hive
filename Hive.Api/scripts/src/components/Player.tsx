import * as React from 'react';
import { Tile } from './Tile';
import { IPlayer } from '../domain';
import { player, playerContainer, playerTile } from '../styles/player';

export const Player: React.FunctionComponent<IPlayer> = ({ name, color, tileListColor, availableTiles }) => {
  return (
    <div className={playerContainer(color, tileListColor)} title={name}>
      <div className={player}>
        {availableTiles.map(tile => (
          <div key={tile.id} className={playerTile}>
            <Tile {...tile}  />
          </div>
        ))}
      </div>
    </div>
  );
};
