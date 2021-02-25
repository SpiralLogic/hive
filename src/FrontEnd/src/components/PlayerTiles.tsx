import { FunctionComponent, h } from 'preact';
import { Player } from '../domain';
import { deepEqual } from 'fast-equals';
import { isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useClassReducer } from '../hooks';
import { useEffect } from 'preact/hooks';
import Tile from './Tile';

type Props = Player;

const PlayerTiles: FunctionComponent<Props> = (props: Props) => {
  const { name, tiles, id } = props;
  const [, route, gameId, currentPlayerId] = window.location.pathname.split('/');
  const changePlayerUrl = `/${route}/${gameId}/${id}`;
  const [classList, setClassList] = useClassReducer(['player', `player${id}`]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isEnterOrSpace(e)) {
      window.location.href = changePlayerUrl;
    }
  };

  useEffect(() => {
    if (!tiles.length) {
      setClassList({ type: 'add', classes: ['hiding'] });
      setTimeout(() => setClassList({ type: 'add', classes: ['hide'] }), 5);
    }
  }, [tiles.length > 0]);

  return (
    <div class={classList.join(' ')} title={name}>
      {Number(currentPlayerId) !== id && tiles.length > 0 ? (
        <a className="name" href={changePlayerUrl} tabIndex={-1} onKeyDown={handleKeyDown}>
          {name}
        </a>
      ) : (
        <div class="name">{name}</div>
      )}
      <div class="tiles">
        {tiles.map((tile) => (
          <Tile key={tile.id} {...tile} />
        ))}
      </div>
    </div>
  );
};

PlayerTiles.displayName = 'Player Tiles';
export default memo(PlayerTiles, deepEqual);
