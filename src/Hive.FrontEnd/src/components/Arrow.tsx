import '../css/arrow.css';
import SVG from './SVG';

export type Direction = 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
const Arrow = ({
  direction,
  result,
  length = 1,
}: {
  direction: Direction;
  result: 'correct' | 'incorrect';
  length?: number;
}) => (
  <SVG
    class={`arrow ${direction} ${result}`}
    style={{ '--span': length }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    hrefs={['arrow']}
  />
);

Arrow.displayName = 'Arrow';
export default Arrow;
