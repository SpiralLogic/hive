import { FunctionComponent, h } from 'preact';

const Tile: FunctionComponent<{ creature: string; classes?: string; [rest: string]: unknown }> = (props) => {
  const { creature, classes, ...rest } = props;
  return (
    <div class={(classes ?? ' ') + ' hex tile'} {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <use href="#hex" />
        <use class="creature" href={`#${creature.toLowerCase()}`} />
      </svg>
    </div>
  );
};
Tile.displayName = 'Tile';
export default Tile;
