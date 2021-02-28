import { Fragment, FunctionComponent, h } from 'preact';
import { GameState, HexCoordinates } from '../domain';
import { createRows } from '../hextille-builder';
import { handleDragOver } from '../handlers';
import Cell from './Cell';
import Hextille from './Hextille';
import PlayerList from './PlayerList';
import Row from './Row';
import Tile from './Tile';

const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;

const GameArea: FunctionComponent<GameState> = ({ players, cells }) => {
  const attributes = {
    ondragover: handleDragOver,
    className: 'hive',
  };
  const sortedHexagons = cells.sort((c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q);
  const shiftClass = sortedHexagons[0].coords.r % 2 ? 'left' : 'right';
  const rows = createRows(sortedHexagons);
  return (
    <div {...attributes}>
      <PlayerList players={players} />
      <Hextille shiftClass={shiftClass}>
        {rows.map((row) => (
          <Row key={row.id}>
            {row.cells.map((cell, i) => (
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
