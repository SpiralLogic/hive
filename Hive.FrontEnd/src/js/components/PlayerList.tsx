import * as React from 'react';
import { useHiveContext } from '../game-context';
import PlayerTiles from './PlayerTiles';

function PlayerList() {
    const { players } = useHiveContext();
    return (
        <div className="players">
            {players.map((player) => (
                <PlayerTiles key={player.id} {...player} />
            ))}
        </div>
    );
}

PlayerList.displayName = 'Player List';

export default PlayerList;
