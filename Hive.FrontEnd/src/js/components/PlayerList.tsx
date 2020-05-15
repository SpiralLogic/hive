import * as React from 'react';
import { PlayerTiles } from './PlayerTiles';
import { Context } from '../gameContext';

export const PlayerList: React.FunctionComponent = () => {
    const { players } = React.useContext(Context).gameState;
    return (
        <div className="players">
            {players.map(player => (
                <PlayerTiles key={player.id} {...player} />
            ))}
        </div>
    );
};
