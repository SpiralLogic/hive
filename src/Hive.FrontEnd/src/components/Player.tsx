import '../css/player.css';

import { ComponentChildren, toChildArray } from 'preact';

import { useAnimatedHide } from '../hooks/useAnimatedHide';

type Properties = {
  name: string;
  id: number;
  children?: ComponentChildren;
};

const Player = (props: Readonly<Properties>) => {
  const { name, id, children } = props;
  const hasNoChildren = toChildArray(children).length === 0;
  const animated = useAnimatedHide(`player player${id}`,hasNoChildren);

  return (
    <section aria-label={`${name}'s unplaced pieces`} {...animated}>
      <h2>{name}</h2>
      <div class="tiles">{children}</div>
    </section>
  );
};

Player.displayName = 'Player Tiles';
export default Player;
