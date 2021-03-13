import '../css/tile.css';
import { FunctionComponent, h } from 'preact';
import Hexagon from './Hexagon';

type Props = { creature?: string; class?: string; [rest: string]: unknown };

const Tile: FunctionComponent<Props> = (props) => {
  const { creature, ...rest } = props;

  const classes = props.class ? [props.class, 'tile'] : ['tile'];
  if (creature) classes.push(creature.toLowerCase());
  rest.class = classes.join(' ');

  const svgs = creature ? [<use className={`creature`} href={`#${creature.toLowerCase()}`} />] : undefined;

  return <Hexagon svgs={svgs} {...rest} />;
};
Tile.displayName = 'Tile';
export default Tile;
