import '../css/tile.css';

import { FunctionComponent, JSX } from 'preact';

import Hexagon from './Hexagon';
import { Signal, useComputed } from '@preact/signals';

type Properties = Partial<JSX.IntrinsicAttributes> & {
  selected?: boolean;
  creature?: string;
  classes?: Signal<string>;
};

const Tile: FunctionComponent<Properties> = (properties) => {
  const { classes, children, selected, creature, ...rest } = properties;
  const tileClasses = useComputed(() => {
    const computedClass = ['tile'];
    if (classes?.value) computedClass.unshift(classes.value);
    if (creature) computedClass.push(`${creature.toLowerCase()}`);
    if (selected) computedClass.push('selected');
    return computedClass.join(' ');
  });

  const svgs = creature ? <use className="creature" href={`#${creature.toLowerCase()}`} /> : undefined;
  return (
    <Hexagon svg={svgs} classes={tileClasses} {...rest}>
      {children}
    </Hexagon>
  );
};
Tile.displayName = 'Tile';
export default Tile;
