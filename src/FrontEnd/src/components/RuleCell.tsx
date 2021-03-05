import { FunctionComponent, h } from 'preact';
import Arrow, { Direction } from './Arrow';
import Cell from './Cell';
import Tile from './Tile';

export const RuleCell: FunctionComponent<{
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
    const char = symbol ? symbol : result === 'correct' ? '✔' : 'x';
    switch (props.result) {
      case 'correct':
        return <span>{char}</span>;
      case 'incorrect':
        return <span>{char}</span>;
    }
    return '';
  };

  return (
    <Cell class={props.result} style={zIndex ? { zIndex } : undefined}>
      <Tile creature={props.creature} {...rest}>
        {getResultChar()}
      </Tile>
      {correct?.map((direction) => (
        <Arrow result="correct" direction={direction instanceof Array ? direction : [direction, undefined]} />
      ))}
      {incorrect?.map((direction) => (
        <Arrow
          result="incorrect"
          direction={direction instanceof Array ? direction : [direction, undefined]}
        />
      ))}
    </Cell>
  );
};
