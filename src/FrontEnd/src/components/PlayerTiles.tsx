import { FunctionComponent, h } from 'preact';
import { Player } from '../domain';
import { deepEqual } from 'fast-equals';
import { isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import Tile from './Tile';

type Props = Player;

const PlayerTiles: FunctionComponent<Props> = (props: Props) => {
  const { name, tiles, id } = props;
  const [, route, gameId, currentPlayerId] = window.location.pathname.split('/');
  const changePlayerUrl = `/${route}/${gameId}/${id}`;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isEnterOrSpace(e)) {
      window.location.href = changePlayerUrl;
    }
  };

  return (
    <div className="player" title={name}>
      {Number(currentPlayerId) !== id ? (
        <a className={`name player${id}`} href={changePlayerUrl} tabIndex={0} onKeyDown={handleKeyDown}>
          {name}
        </a>
      ) : (
        <div className="name">{name}</div>
      )}
      <div className="tiles">
        {tiles.map((tile) => (
            <svg   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"> <Tile key={tile.id} {...tile} /></svg>
        ))}
      </div>
    </div>
  );
};

PlayerTiles.displayName = 'Player Tiles';
export default memo(PlayerTiles, deepEqual);
