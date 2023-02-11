import '../css/tile.css';

import { FunctionComponent, JSX } from 'preact';

import Hexagon from './Hexagon';
import { Signal, useComputed } from '@preact/signals';
import { useMemo } from 'preact/hooks';

type Properties = Partial<JSX.IntrinsicAttributes> & {
  selected?: boolean;
  creature?: string;
  classes?: Signal<string>;
};

const Tile: FunctionComponent<Properties> = (properties) => {
  const { classes, children, selected, creature, ...rest } = properties;
  const svg = useMemo(
    () => (creature ? <use className="creature" href={`#${creature.toLowerCase()}`} /> : undefined),
    [creature]
  );
  const tileClasses = useComputed(() => {
    const computedClass = ['tile'];
    if (classes?.value) computedClass.unshift(classes.value);
    if (creature) computedClass.push(`${creature.toLowerCase()}`);
    if (selected) computedClass.push('selected');
    return computedClass.join(' ');
  });

  return (
    <Hexagon svg={svg} classes={tileClasses} {...rest}>
      {children}
    </Hexagon>
  );
};
Tile.displayName = 'Tile';
export default Tile;
