import '../css/arrow.css';
import { FunctionComponent, h } from 'preact';
export type Direction = 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export const Arrow: FunctionComponent<{
  direction: Direction;
  result: 'correct' | 'incorrect';
  length?: number;
}> = ({ direction, result, length = 1 }) => {
  return (
    <svg
      class={`arrow ${direction} ${result}`}
      style={{ '--span': length }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100">
      <use href="#arrow" />
    </svg>
  );
};

Arrow.displayName = 'Arrow';
export default Arrow;
