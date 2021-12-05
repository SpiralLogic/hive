import '../css/player.css';

import { FunctionComponent, h, toChildArray } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { PlayerId } from '../domain';
import { useClassReducer } from '../utilities/class-reducer';

type Properties = {
  name: string;
  id: PlayerId;
};
const Player: FunctionComponent<Properties> = (properties) => {
  const { name, id } = properties;
  const [classes, setClassList] = useClassReducer(`player player${id}`);
  const [hidden, setHidden] = useState(false);
  const children = toChildArray(properties.children).length;
  useEffect(() => {
    if (children === 0) {
      setTimeout(() => setClassList({ type: 'add', classes: ['hide'] }), 100);
    }
  }, [children, setClassList]);

  const ontransitionend = () => {
    setHidden(toChildArray(properties.children).length === 0);
  };

  return hidden ? null : (
    <div class={classes} title={name} onAnimationEnd={ontransitionend} onTransitionEnd={ontransitionend}>
      <div class="name">{name}</div>
      <div class="tiles">{properties.children}</div>
    </div>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
