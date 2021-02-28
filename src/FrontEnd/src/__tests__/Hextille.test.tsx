import { HexCoordinates } from '../domain';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import Cell from '../components/Cell';
import Hextille from '../components/Hextille';
import Tile from '../components/Tile';

describe('Hextille Tests', () => {
  const createCell = (q: number, r: number) => (
    <Cell coords={{ q, r }}>
      <Tile {...{ creature: q + '-' + r, id: 0, playerId: 0, moves: [] as HexCoordinates[] }} />
    </Cell>
  );

  describe('Hextille Snapshot', () => {
    test('can move matches current snapshot', () => {
      expect(render(<Hextille shiftClass={'left'} />)).toMatchSnapshot();
    });
  });
});
