import * as React from 'react';
import {  useGameContext } from '../gameContext';
import { PlayerTiles } from './PlayerTiles';

export const PlayerList: React.FunctionComponent = () => {
    const { players } = useGameContext();
    return (
        <div className="players">
            {players.map(player => (
                <PlayerTiles key={player.id} {...player} />
            ))}
        </div>
    );
};

PlayerList.displayName = 'Player List';