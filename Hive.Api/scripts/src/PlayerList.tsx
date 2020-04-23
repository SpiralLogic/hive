import * as React from 'react';
import { Context } from './GameContext';
import { Player } from './Player';
import { listContainer } from './styles/player';

const usingPlayers = () => {
  const {
    gameState: { cells, ...playerInfo },
  } = React.useContext(Context);
  return playerInfo;
};

export const PlayerList: React.StatelessComponent = () => {
  const { players } = usingPlayers();
  return (
    <div className={listContainer}>
      {players.map(player => (
        <Player key={player.id} {...player} />
      ))}
    </div>
  );
};

PlayerList.displayName = 'PlayerList';
