import { useGameState } from '../services/gameStateContext';
import { HexCoordinate } from '../domain';
import { cellKey } from '../utilities/hextille';
import { useComputed } from '@preact/signals';
import { HextilleBuilder } from '../services';
import { dispatcher } from '../hooks/useHiveDispatchListener';
import Hextille from './Hextille';
import Row from './Row';
import GameCell from './GameCell';
import Tiles from './Tiles';
import { HistoricalMove } from '../domain/historical-move';

const isPreviousMove = (history: HistoricalMove[], coords: HexCoordinate) => {
  if (!history.length) return false;
  const previousMove = history[history.length - 1];
  return (
    (previousMove.move.coords.q === coords.q && previousMove.move.coords.r === coords.r) ||
    (previousMove.originalCoords?.q === coords.q && previousMove.originalCoords.r === coords.r)
  );
};

const Game = (props: { currentPlayer: number }) => {
  const { cells, history } = useGameState();

  const rows = useComputed(() => {
    const hextilleBuilder = new HextilleBuilder(cells.value);
    return hextilleBuilder.createRows();
  });

  dispatcher.dispatch({ type: 'tileClear' });
  return (
    <Hextille>
      {rows.value.map((row) => (
        <Row key={`${row.id}`} {...row}>
          {row.cells.map((cell) => (
            <GameCell
              historical={isPreviousMove(history.value, cell.coords)}
              key={cellKey(cell.coords)}
              coords={cell.coords}
              hidden={!!cell.hidden}>
              <Tiles cell={cell} currentPlayer={props.currentPlayer} />
            </GameCell>
          ))}
        </Row>
      ))}
    </Hextille>
  );
};
Game.displayName = 'Game';
export default Game;
