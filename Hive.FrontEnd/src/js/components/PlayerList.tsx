import { useHiveContext } from '../game-context';
import PlayerTiles from './PlayerTiles';
import * as React from 'preact/compat';

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
