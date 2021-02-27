import { FunctionComponent, h } from 'preact';
import { GameState, HexCoordinates } from '../domain';
import { createRows } from '../hextille-builder';
import Cell from './Cell';
import Row from './Row';
import Tile from './Tile';
type Props = Pick<GameState, 'cells'>;

const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const Hextille: FunctionComponent<Props> = ({ cells }) => {
  const sortedHexagons = cells.sort((c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q);
  const shiftClass = sortedHexagons[0].coords.r % 2 ? 'left' : 'right';
  const rows = createRows(sortedHexagons);
  return (
    <div className="hex-container">
      <main className={`hextille  ${shiftClass}`}>
        {rows.map((row) => (
          <Row key={row.id}>
            {row.cells.map((cell, i) => (
              <Cell key={cellKey(cell.coords)} coords={cell.coords} hidden={cell.hidden}>
                {cell.tiles.slice(0, 1).map((tile) => (
                  <Tile {...tile} />
                ))}
              </Cell>
            ))}
          </Row>
        ))}
      </main>
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
