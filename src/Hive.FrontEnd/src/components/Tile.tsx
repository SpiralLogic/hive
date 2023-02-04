import '../css/tile.css';

import { FunctionComponent } from 'preact';

import Hexagon from './Hexagon';
import { computed, Signal } from '@preact/signals';
import { useClassSignal } from '../hooks/useClassReducer';

type Properties = {
  selected?: boolean;
  creature?: string;
  classes: Signal<string>;
  classAction: ReturnType<typeof useClassSignal>[1];

  [rest: string]: unknown;
};

const Tile: FunctionComponent<Properties> = (properties) => {
  const { classes, children, classAction, selected, creature, ...rest } = properties;
  classAction.add('tile');
  if (creature) classAction.add(`${creature.toLowerCase()}`);
  if (selected) classAction.add('selected');

  const svgs = creature ? <use className={`creature`} href={`#${creature.toLowerCase()}`} /> : undefined;
  return (
    <Hexagon svgs={svgs} {...rest} classes={classes}>
      {children}
    </Hexagon>
  );
};
Tile.displayName = 'Tile';
export default Tile;
