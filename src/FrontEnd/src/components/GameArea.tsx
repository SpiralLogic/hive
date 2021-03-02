import { FunctionComponent, h } from 'preact';
import { GameState, HexCoordinates, PlayerId } from '../domain';
import { createRows, removeOtherPlayerMoves } from '../utilities/hextille-builder';
import { handleDragOver } from '../utilities/handlers';
import Cell from './Cell';
import Hextille from './Hextille';
import Players from './PlayerList';
import Row from './Row';
import Tile from './Tile';

const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;

const GameArea: FunctionComponent<Pick<GameState, 'players' | 'cells'> & { playerId: PlayerId }> = ({
  players,
  cells,
  playerId,
}) => {
  const attributes = {
    ondragover: handleDragOver,
    className: 'hive',
  };
  removeOtherPlayerMoves(playerId, { players, cells });

  const rows = createRows(cells);
  return (
    <div {...attributes}>
      <Players players={players} />
      <Hextille>
        {rows.map((row) => (
          <Row key={row.id}>
            {row.cells.map((cell) => (
              <Cell key={cellKey(cell.coords)} coords={cell.coords} hidden={cell.hidden}>
                {cell.tiles.slice(0, 1).map((tile) => (
                  <Tile key={tile.id} {...tile} />
                ))}
              </Cell>
            ))}
          </Row>
        ))}
      </Hextille>
    </div>
  );
};

GameArea.displayName = 'GameArea';
export default GameArea;
