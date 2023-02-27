import '../css/player.css';

import { ComponentChildren, toChildArray } from 'preact';
import { useEffect } from 'preact/hooks';

import { PlayerId } from '../domain';
import { useClassSignal } from '../hooks/useClassReducer';

type Properties = {
  name: string;
  id: PlayerId;
  children?: ComponentChildren;
};
const Player = (properties: Properties) => {
  const { name, id, children } = properties;
  const [classes, classAction] = useClassSignal(`player player${id}`);
  const hasNoChildren = toChildArray(children).length === 0;

  useEffect(() => {
    if (hasNoChildren) {
      setTimeout(() => classAction.add('hide'), 100);
    }
  }, [hasNoChildren, classAction]);

  const ontransitionend = () => {
    if (classes.peek().includes('hide')) classAction.add('hidden');
  };

  const handlers = { onTransitionEnd: ontransitionend, onAnimationEnd: ontransitionend };

  return (
    <section class={classes} aria-label={`${name}'s unplaced pieces`} {...handlers}>
      <h2>{name}</h2>
      <div class="tiles">{children}</div>
    </section>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
