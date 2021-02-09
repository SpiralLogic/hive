import { FunctionComponent, h } from 'preact';
import { Player } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleKeyboardClick } from '../handlers';
import { memo } from 'preact/compat';
import Tile from './Tile';

type Props = Player;

const PlayerTiles: FunctionComponent<Props> = (props: Props) => {
  const { name, tiles, id } = props;
  const [, route, gameId, currentPlayerId] = window.location.pathname.split('/');
  const changePlayerUrl = `/${route}/${gameId}/${id}`;

  return (
    <div className="player" title={name}>
      {Number(currentPlayerId) !== id ? (
        <a className="name" href={changePlayerUrl} tabIndex={3} onKeyDown={handleKeyboardClick}>
          {name}
        </a>
      ) : (
        <div className="name">{name}</div>
      )}
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
