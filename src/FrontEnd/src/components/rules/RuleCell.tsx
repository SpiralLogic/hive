import { FunctionComponent, h } from 'preact';
import Arrow, { Direction } from '../Arrow';
import Hexagon from '../Hexagon';
import Tile from '../Tile';
type Result = 'correct' | 'incorrect';
type Arrows = ([Direction, number | undefined] | Direction)[];

const createArrows = (arrows: Arrows | undefined, style: Result) =>
  arrows?.map((a) => {
    const [direction, length] = a instanceof Array ? a : [a];
    return <Arrow result={style} direction={direction} length={length} />;
  });

const getResultChar = (result?: Result, symbol?: string) => {
  const char = symbol ? symbol : result === 'correct' ? <span>&#10003;</span> : <span>&#10008;</span>;
  switch (result) {
    case 'correct':
      return <span>{char}</span>;
    case 'incorrect':
      return <span>{char}</span>;
    default:
      return '';
  }
};

const RuleCell: FunctionComponent<{
  result?: Result;
  creature?: string;
  symbol?: string;
  zIndex?: number;
  class?: string;
  correctArrows?: Arrows;
  incorrectArrows?: Arrows;
}> = (props) => {
  const { correctArrows, incorrectArrows, symbol, zIndex, result, ...rest } = props;

  return (
    <Hexagon role="cell" class={result} style={zIndex ? { zIndex } : undefined}>
      <Tile {...rest}>{getResultChar(result, symbol)}</Tile>
      {createArrows(correctArrows, 'correct')}
      {createArrows(incorrectArrows, 'incorrect')}
    </Hexagon>
  );
};

RuleCell.displayName = 'RuleCell';
export default RuleCell;
