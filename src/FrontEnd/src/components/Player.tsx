import { FunctionComponent, h } from 'preact';
import { PlayerId } from '../domain';
import { useClassReducer } from '../utilities/hooks';
import { useEffect } from 'preact/hooks';

type Props = { name: string; hide: boolean; id: PlayerId };
const Player: FunctionComponent<Props> = (props) => {
  const { name, hide, id } = props;
  const [classes, setClassList] = useClassReducer(`player player${id}${hide ? '' : ' hide'}`);

  useEffect(() => {
    if (!hide && !classes.includes('hide')) {
      setClassList({ type: 'add', classes: ['hiding'] });
      setTimeout(() => setClassList({ type: 'add', classes: ['hide'] }), 50);
    }
  }, [hide]);

  return (
    <div class={classes} title={name}>
      <div class="name">{name}</div>
      <div class="tiles">{props.children}</div>
    </div>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
