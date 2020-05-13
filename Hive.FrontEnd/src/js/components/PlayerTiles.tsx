import * as React from 'react';
import { Tile } from './Tile';
import { Player } from '../domain';

export const PlayerTiles: React.FunctionComponent<Player> = ({ id, name, availableTiles }) => {
    return (
        <div key={id} className="player" title={name}>
            <span className="name"> {name} </span>
            <div className="tiles">
                {availableTiles.map(tile => <Tile {...tile}/>)}
            </div>
        </div>
    );
};
