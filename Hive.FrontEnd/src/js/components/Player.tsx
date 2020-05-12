import * as React from 'react';
import { Tile } from './Tile';
import { IPlayer } from '../domain';

export const Player: React.FunctionComponent<IPlayer> = ({ name, availableTiles }) => {
    return (
        <div className="player" title={name}>
            <span className="name" > {name} </span>
            <div className="tiles">
                {availableTiles.map(tile => (
                    <Tile key={tile.id} {...tile}  />
                ))}
            </div>      
        </div>
    );
};
