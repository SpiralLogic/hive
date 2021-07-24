import '../css/tile.css';
import { FunctionComponent } from 'preact';
import Hexagon from './Hexagon';

type Props = { selected?: boolean; creature?: string; class?: string; [rest: string]: unknown };

const Tile: FunctionComponent<Props> = (props) => {
  const { selected, creature, ...rest } = props;

  const classes = props.class ? [props.class, 'tile'] : ['tile'];
  if (creature) classes.push(creature.toLowerCase());
  if (selected) classes.push('selected');
  rest.class = classes.join(' ');

  const svgs = creature ? [<use className={`creature`} href={`#${creature.toLowerCase()}`} />] : undefined;

  return <Hexagon svgs={svgs} {...rest} />;
};
Tile.displayName = 'Tile';
export default Tile;
