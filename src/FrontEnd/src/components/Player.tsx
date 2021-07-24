import { FunctionComponent, toChildArray } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import '../css/player.css';
import { PlayerId } from '../domain';
import { useClassReducer } from '../utilities/class-reducer';

type Props = {
  name: string;
  id: PlayerId;
};
const Player: FunctionComponent<Props> = (props) => {
  const { name, id } = props;
  const [classes, setClassList] = useClassReducer(`player player${id}`);
  const [hidden, setHidden] = useState(false);
  const children = toChildArray(props.children).length;
  useEffect(() => {
    if (children === 0) {
      setTimeout(() => setClassList({ type: 'add', classes: ['hide'] }), 100);
    }
  }, [children]);

  const ontransitionend = () => {
    setHidden(true);
  };

  return hidden ? null : (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <div class={classes} title={name} onanimationend={ontransitionend} ontransitionend={ontransitionend}>
      <div class="name">{name}</div>
      <div class="tiles">{props.children}</div>
    </div>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
