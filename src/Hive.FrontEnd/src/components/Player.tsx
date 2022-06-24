import '../css/player.css';

import { FunctionComponent, toChildArray } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { PlayerId } from '../domain';
import { useClassReducer } from '../utilities/class-reducer';

type Properties = {
  name: string;
  id: PlayerId;
};
const Player: FunctionComponent<Properties> = (properties) => {
  const { name, id, children } = properties;
  const [classes, setClassList] = useClassReducer(`player player${id}`);
  const [hidden, setHidden] = useState(false);
  const hasChildren = toChildArray(children).length === 0;

  useEffect(() => {
    if (hasChildren) {
      setTimeout(() => setClassList({ type: 'add', classes: ['hide'] }), 100);
    }
  }, [hasChildren, setClassList]);

  const ontransitionend = () => {
    setHidden(hasChildren);
  };

  const handlers = { onTransitionEnd: ontransitionend, onAnimationEnd: ontransitionend };

  return hidden ? null : (
    <section class={classes} aria-label={`${name}'s unplaced pieces`} {...handlers}>
      <h2>{name}</h2>
      <div class="tiles">{children}</div>
    </section>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
