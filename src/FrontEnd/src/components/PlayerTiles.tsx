import { FunctionComponent, h } from 'preact';
import { Player } from '../domain';
import { deepEqual } from 'fast-equals';
import { memo } from 'preact/compat';
import Tile from './Tile';

type Props = Player;

const PlayerTiles: FunctionComponent<Props> = (props: Props) => {
  const { name, tiles } = props;
  return (
    <div className="player" title={name}>
      <span className="name">{name}</span>
      <div className="tiles">
        {tiles.map((tile) => (
          <Tile key={tile.id} {...tile} />
        ))}
      </div>
    </div>
  );
};

PlayerTiles.displayName = 'Player Tiles';
export default memo(PlayerTiles, deepEqual);
