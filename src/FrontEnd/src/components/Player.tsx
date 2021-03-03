import { FunctionComponent, h } from 'preact';
import { PlayerId } from '../domain';
import { useClassReducer } from '../utilities/hooks';
import { useEffect } from 'preact/hooks';

const Player: FunctionComponent<{ name: string; hide: boolean; id: PlayerId; currentPlayer: PlayerId }> = (
  props
) => {
  const { name, hide, id, currentPlayer } = props;
  const [classes, setClassList] = useClassReducer(`player player${id}${hide ? '' : ' hide'}`);

  useEffect(() => {
    if (!hide && !classes.includes('hide')) {
      setClassList({ type: 'add', class: 'hiding' });
      setTimeout(() => setClassList({ type: 'add', class: 'hide' }), 50);
    }
  }, [hide]);

  const opponentGame = {
    title: 'Hive board game',
    text: 'Share game to opponent!',
    url: `${window.location.href.slice(0, -1)}${id}`,
  };
  const onClickHandler = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(opponentGame.url).then();
    } catch {
      navigator.share(opponentGame).then();
    }
    return false;
  };

  return (
    <div class={classes} title={name}>
      <div class="name" title={'share link for opponent'}>
        {id === currentPlayer ? (
          name
        ) : (
          <svg onClick={onClickHandler} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            {' '}
            <use href="#share" />{' '}
          </svg>
        )}
      </div>
      <div class="tiles">{props.children}</div>
    </div>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
