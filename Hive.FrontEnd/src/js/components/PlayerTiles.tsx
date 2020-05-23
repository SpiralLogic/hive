import * as React from 'react';
import { Player } from '../domain';
import Tile from './Tile';

type Props = Player;

function PlayerTiles (props: Props) {
    const { name, availableTiles } = props;
    return (
        <div className="player" title={name}>
            <span className="name"> {name} </span>
            <div className="tiles">
                {availableTiles.map((tile) => (
                    <Tile key={tile.id} {...tile} />
                ))}
            </div>
        </div>
    );
}

PlayerTiles.displayName = 'Player Tiles';
export default React.memo(PlayerTiles, (p, n) => p.id === n.id && p.availableTiles.length === n.availableTiles.length && p.availableTiles.every((t, i) => t.availableMoves.length == n.availableTiles[i].availableMoves.length));
