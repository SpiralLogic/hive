import * as React from 'react';
import { PlayerTiles } from './PlayerTiles';
import {Player} from '../domain';

export const PlayerList: React.FunctionComponent<{players:Player[]}> = ({players}) => {
    return (
        <div className="players">
            {players.map(player => (
                <PlayerTiles key={player.id} {...player} />
            ))}
        </div>
    );
};

PlayerList.displayName='Player List';