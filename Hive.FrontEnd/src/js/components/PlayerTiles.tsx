import * as React from 'react';
import { Player } from '../domain';
import Tile from './Tile';

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