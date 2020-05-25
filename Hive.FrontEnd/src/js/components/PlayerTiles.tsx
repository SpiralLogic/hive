import React from 'preact/compat';
import { Player } from '../domain';
import Tile from './Tile';
import isEqual from 'react-fast-compare';

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
const PlayerTilesMemo = React.memo(PlayerTiles, isEqual);

export default PlayerTilesMemo;
