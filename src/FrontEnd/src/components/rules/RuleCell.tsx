import { FunctionComponent, h } from 'preact';
import Arrow, { Direction } from '../Arrow';
import Hexagon from '../Hexagon';
import Tile from '../Tile';

const RuleCell: FunctionComponent<{
  result?: 'correct' | 'incorrect';
  creature?: string;
  symbol?: string;
  zIndex?: number;
  class?: string;
  correct?: ([Direction, number | undefined] | Direction)[];
  incorrect?: ([Direction, number | undefined] | Direction)[];
}> = (props) => {
  const { correct, incorrect, symbol, zIndex, result, ...rest } = props;
  const getResultChar = () => {
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

  return (
    <Hexagon role="cell" class={result} style={zIndex ? { zIndex } : undefined}>
      <Tile {...rest}>{getResultChar()}</Tile>
      {correct?.map((direction) => (
        <Arrow result="correct" direction={direction instanceof Array ? direction : [direction, undefined]} />
      ))}
      {incorrect?.map((direction) => (
        <Arrow
          result="incorrect"
          direction={direction instanceof Array ? direction : [direction, undefined]}
        />
      ))}
    </Hexagon>
  );
};

RuleCell.displayName = 'RuleCell';
export default RuleCell;
