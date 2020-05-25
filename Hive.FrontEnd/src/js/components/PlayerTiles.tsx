import { Player } from '../domain';
import Tile from './Tile';
import { deepEqual } from 'fast-equals';
import * as React from 'preact/compat';

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
const PlayerTilesMemo = React.memo(PlayerTiles, deepEqual);

export default PlayerTilesMemo;
