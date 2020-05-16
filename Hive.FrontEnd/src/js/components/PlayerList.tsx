import * as React from 'react';
import { PlayerTiles } from './PlayerTiles';
import { HiveContext } from '../gameContext';

export const PlayerList: React.FunctionComponent = () => {
    const { players } = React.useContext(HiveContext).gameState;
    return (
        <div className="players">
            {players.map(player => (
                <PlayerTiles key={player.id} {...player} />
            ))}
        </div>
    );
};

PlayerList.displayName='Player List';