import * as React from 'react';
import { Tile } from './Tile';
import { Player } from '../domain';

export const PlayerTiles: React.FunctionComponent<Player> = ({ name, availableTiles }) => {
    return (
        <div className="player" title={name}>
            <span className="name"> {name} </span>
            <div className="tiles">
                {availableTiles.map(tile => <Tile key={tile.id} {...tile}/>)}
            </div>
        </div>
    );
};

PlayerTiles.displayName='Player Tiles';