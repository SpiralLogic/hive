import { FunctionComponent } from 'preact';
import { JSXInternal } from 'preact/src/jsx';

import Arrow, { Direction } from '../Arrow';
import Hexagon from '../Hexagon';
import Tile from '../Tile';

type Result = 'correct' | 'incorrect';
type Arrows = ([Direction, number | undefined] | Direction)[];

const createArrows = (arrows: Arrows | undefined, style: Result) =>
  arrows?.map((a) => {
    const [direction, length] = Array.isArray(a) ? a : [a];
    return <Arrow key={direction} result={style} direction={direction} length={length} />;
  });

const getResultChar = (result?: Result, symbol?: string) => {
  if (symbol) return <span>{symbol}</span>;
  switch (result) {
    case 'correct':
      return <span>&#10003;</span>;

    case 'incorrect':
      return <span>&#10008;</span>;

    default:
      return null;
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
}> = (properties) => {
  const { correctArrows, incorrectArrows, symbol, zIndex, result, ...rest } = properties;
  if (properties.selected) {
    properties.zIndex = 4;
  }

  const classes = [];
  if (result) classes.push(result);
  if (!properties.creature && !result) classes.push('blank');

  return (
    <Hexagon
      role="cell"
      class={classes.length > 0 ? classes.join(' ') : undefined}
      style={zIndex ? { zIndex } : undefined}>
      <Tile {...rest}>{getResultChar(result, symbol)}</Tile>
      {createArrows(correctArrows, 'correct')}
      {createArrows(incorrectArrows, 'incorrect')}
    </Hexagon>
  );
};

RuleCell.displayName = 'RuleCell';
export default RuleCell;
