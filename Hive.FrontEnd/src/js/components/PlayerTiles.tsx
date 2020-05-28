import { deepEqual } from 'fast-equals';
import { h } from 'preact';
import { memo } from 'preact/compat';
import { Player } from '../domain';
import Tile from './Tile';

type Props = Player;

function PlayerTiles(props: Props) {
    const { name, availableTiles } = props;
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

PlayerTiles.displayName = 'Player Tiles';

export default memo(PlayerTiles, deepEqual);
