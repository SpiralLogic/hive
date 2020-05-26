import {Player} from '../domain';
import Tile from './Tile';
import {deepEqual} from 'fast-equals';
import React from 'preact/compat';

type Props = Player;

function PlayerTilesFC(props: Props) {
    const {name, availableTiles} = props;
    return (
        <div className="player" title={name}>
            <span className="name">{name}</span>
            <div className="tiles">
                {availableTiles.map((tile) => (
                    <Tile key={tile.id} {...tile}/>
                ))}
            </div>
        </div>
    );
}

PlayerTilesFC.displayName = 'Player Tiles';
const PlayerTiles = React.memo(PlayerTilesFC, deepEqual);

export default PlayerTiles;
