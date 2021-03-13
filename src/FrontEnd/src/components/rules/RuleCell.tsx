import { FunctionComponent, h } from 'preact';
import { JSXInternal } from 'preact/src/jsx';
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
  selected?: boolean;
  correctArrows?: Arrows;
  incorrectArrows?: Arrows;
  style?: JSXInternal.CSSProperties;
}> = (props) => {
  const { selected, correctArrows, incorrectArrows, symbol, zIndex, result, ...rest } = props;
  if (selected) {
    props.zIndex = 4;
  }

  return (
    <Hexagon role="cell" class={result} style={props.zIndex ? { zIndex: props.zIndex } : undefined}>
      <Tile class={selected ? 'selected' : undefined} {...rest}>
        {getResultChar(result, symbol)}
      </Tile>
      {createArrows(correctArrows, 'correct')}
      {createArrows(incorrectArrows, 'incorrect')}
    </Hexagon>
  );
};

RuleCell.displayName = 'RuleCell';
export default RuleCell;
