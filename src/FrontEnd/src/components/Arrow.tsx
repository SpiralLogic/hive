import { FunctionComponent, h } from 'preact';
export type Direction = 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export const Arrow: FunctionComponent<{
  direction: [Direction, number | undefined];
  result?: 'correct' | 'incorrect';
}> = ({ direction, result }) => {
  const [direct, span] = direction;
  const style = span && span > 1 ? { '--span': span } : undefined;
  return (
    <svg
      class={`arrow ${[direct, result].join(' ')}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100">
      <use href="#arrow" />
    </svg>
  );
};

Arrow.displayName = 'Arrow';
export default Arrow;
