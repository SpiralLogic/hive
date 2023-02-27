import '../css/tile.css';

import { ComponentChildren, JSX } from 'preact';

import Hexagon from './Hexagon';
import { Signal, useComputed } from '@preact/signals';
import { Creature } from '../domain';

type Properties = JSX.IntrinsicAttributes & {
  selected?: boolean;
  creature?: Creature;
  classes?: Signal<string>;
  children?: ComponentChildren;
};

const Tile = (properties: Properties) => {
  const { classes, children, selected, creature, ...rest } = properties;
  const tileClasses = useComputed(() => {
    const computedClass = ['tile'];
    if (classes?.value) computedClass.unshift(classes.value);
    if (creature) computedClass.push(`${creature.toLowerCase()}`);
    if (selected) computedClass.push('selected');
    return computedClass.join(' ');
  });

  return (
    <Hexagon creature={creature} classes={tileClasses} {...rest}>
      {children}
    </Hexagon>
  );
};
Tile.displayName = 'Tile';
export default Tile;
