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
  const [classList, setClassList] = useClassReducer(['player', `player${id}`]);
  const [, route, gameId] = window.location.pathname.split('/');
  const changePlayerUrl = `/${route}/${gameId}/${id}`;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isEnterOrSpace(e)) {
      window.location.href = changePlayerUrl;
    }
  };

  useEffect(() => {
    if (!tiles.length && !classList.includes('hide')) {
      setClassList({ type: 'add', classes: ['hiding'] });
      setTimeout(() => setClassList({ type: 'add', classes: ['hide'] }), 50);
    }
  }, [tiles.length > 0]);
  if (!tiles.length) classList.push('hide');

  function getName() {
    return (
      <a class="name" href={`/${route}/${gameId}/2`} tabIndex={-1} onKeyDown={handleKeyDown}>
        {name}
      </a>
    );
  }

  return (
    <div class={classList.join(' ')} title={name}>
      {getName()}
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
