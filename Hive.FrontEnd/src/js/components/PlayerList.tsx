import * as React from 'react';
import { Player } from './Player';
import { Context } from '../GameContext';

export const PlayerList: React.FunctionComponent = () => {
    const { players } = React.useContext(Context).gameState;
    return (
        <div className="players">
            {players.map(player => (
                <Player key={player.id} {...player} />
            ))}
        </div>
    );
};
