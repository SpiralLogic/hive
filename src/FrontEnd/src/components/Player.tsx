import { FunctionComponent, h } from 'preact';
import { PlayerId } from '../domain';
import { useClassReducer } from '../utilities/hooks';
import { useEffect } from 'preact/hooks';

const Player: FunctionComponent<{ name: string; hide: boolean; id: PlayerId }> = (props) => {
  const { name, hide, id } = props;
  const [classes, setClassList] = useClassReducer(`player player${id}${hide ? '' : ' hide'}`);

  useEffect(() => {
    if (!hide && !classes.includes('hide')) {
      setClassList({ type: 'add', class: 'hiding' });
      setTimeout(() => setClassList({ type: 'add', class: 'hide' }), 50);
    }
  }, [hide]);

  return (
    <div class={classes} title={name}>
      <p class="name"> {name}</p>
      <div class="tiles">{props.children}</div>
    </div>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
