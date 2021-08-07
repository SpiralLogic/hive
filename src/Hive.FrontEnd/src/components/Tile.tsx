import '../css/tile.css';

import { FunctionComponent } from 'preact';

import Hexagon from './Hexagon';

type Properties = { selected?: boolean; creature?: string; class?: string; [rest: string]: unknown };

const Tile: FunctionComponent<Properties> = (properties) => {
  const { selected, creature, ...rest } = properties;

  const classes = properties.class ? [properties.class, 'tile'] : ['tile'];
  if (creature) classes.push(creature.toLowerCase());
  if (selected) classes.push('selected');
  rest.class = classes.join(' ');

  const svgs = creature ? [<use className={`creature`} href={`#${creature.toLowerCase()}`} />] : undefined;

  return <Hexagon svgs={svgs} {...rest} />;
};
Tile.displayName = 'Tile';
export default Tile;
