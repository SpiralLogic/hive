import { Cell } from '../domain';
import { FunctionComponent, h } from 'preact';
import { createRows } from '../hextille-builder';
import Row from './Row';
type Props = { cells: Cell[] };

const Hextille: FunctionComponent<Props> = (props: Props) => {
  const { cells } = props;
  const sortedHexagons = cells.sort((c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q);
  const shiftClass = sortedHexagons[0].coords.r % 2 ? 'left' : 'right';
  const rows = createRows(sortedHexagons);

  return (
    <div className="hex-container">
      <main className={`hextille  ${shiftClass}`}>
        {rows.map((row) => (
          <Row key={row.id} {...row} />
        ))}
      </main>
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
