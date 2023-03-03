import {FunctionComponent} from 'preact';
import {JSXInternal} from 'preact/src/jsx';

import Arrow, {Direction} from '../Arrow';
import Hexagon from '../Hexagon';
import Tile from '../Tile';
import {useClassSignal} from '../../hooks/useClassSignal';
import {Creature} from '../../domain';

type Result = 'correct' | 'incorrect';
type CellArrows = ([Direction, number | undefined] | Direction)[];

const Arrows = ({arrows, result}: { arrows: CellArrows | undefined; result: Result }) => (
    <>
        {arrows?.map((a) => {
            const [direction, length] = Array.isArray(a) ? a : [a];
            return <Arrow key={direction} result={result} direction={direction} length={length}/>;
        })}
  </>
);

const ResultChar = ({ result, symbol }: { result?: Result; symbol?: string }) => {
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
  creature?: Creature;
  symbol?: string;
  zIndex?: number;
  selected?: boolean;
  correctArrows?: CellArrows;
  incorrectArrows?: CellArrows;
  style?: JSXInternal.CSSProperties;
}> = (properties) => {
  const { correctArrows, incorrectArrows, symbol, zIndex, result, ...rest } = properties;
  const [classes, classAction] = useClassSignal();
  if (result) classAction.add(result);
  if (!properties.creature && !result) classAction.add('blank');

  return (
    <Hexagon role="cell" classes={classes} style={properties.selected ? { zIndex: 4 } : { zIndex }}>
      <>
        <Tile {...rest}>
          <ResultChar result={result} symbol={symbol} />
        </Tile>
        <Arrows arrows={correctArrows} result="correct" />
        <Arrows arrows={incorrectArrows} result="incorrect" />
      </>
    </Hexagon>
  );
};

RuleCell.displayName = 'RuleCell';
export default RuleCell;
