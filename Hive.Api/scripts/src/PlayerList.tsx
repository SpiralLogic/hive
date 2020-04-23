import * as React from 'react';
import {Context} from './GameContext';
import {Player} from './Player';
import {listContainer} from './styles/player';

const usingPlayers = () => {
    const {
        gameState: {cells, players},
    } = React.useContext(Context);
    return players;
};

export const PlayerList: React.FunctionComponent = () => {
    const players = usingPlayers();
    return (
        <div className={listContainer}>
            {players.map(player => (
                <Player key={player.id} {...player} />
            ))}
        </div>
    );
};
