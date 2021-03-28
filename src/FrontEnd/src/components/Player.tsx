import '../css/player.css';
import { FunctionComponent, h, toChildArray } from 'preact';
import { useEffect } from 'preact/hooks';
import { PlayerId } from '../domain';
import { useClassReducer } from '../utilities/class-reducer';

type Props = {
  name: string;
  id: PlayerId;
  onHidden: (action: [boolean, number]) => void;
};
const Player: FunctionComponent<Props> = (props) => {
  const { name, id, onHidden } = props;
  const [classes, setClassList] = useClassReducer(`player player${id}`);

  useEffect(() => {
    if (!toChildArray(props.children).length) {
      setTimeout(() => setClassList({ type: 'add', classes: ['hide'] }), 100);
    }
  }, [toChildArray(props.children).length === 0]);

  const ontransitionend = () => onHidden([toChildArray(props.children).length === 0, id]);

  return (
    <div class={classes} title={name} onTransitionEnd={ontransitionend}>
      <div class="name">{name}</div>
      <div class="tiles">{props.children}</div>
    </div>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
