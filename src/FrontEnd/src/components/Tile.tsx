import { FunctionComponent, h } from 'preact';

const Tile: FunctionComponent<{ creature?: string; class?: string; [rest: string]: unknown }> = (props) => {
  const { creature, ...rest } = props;

  const classes = props.class ? [props.class, 'tile'] : ['tile'];
  if (creature) classes.push('creature');
  rest.class = classes.join(' ');

  return (
    <div {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <use href="#hex" />
        {creature ? (
          <use class={`creature ${creature.toLowerCase()}`} href={`#${creature.toLowerCase()}`} />
        ) : (
          ''
        )}
      </svg>
      {props.children}
    </div>
  );
};
Tile.displayName = 'Tile';
export default Tile;
