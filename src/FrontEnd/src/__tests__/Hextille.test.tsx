import { HexCoordinates } from '../domain';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import ActiveCell from '../components/ActiveCell';
import ActiveTile from '../components/ActiveTile';
import Hextille from '../components/Hextille';
import Row from '../components/Row';

describe('Hextille Tests', () => {
  const createCell = (q: number, r: number) => (
    <ActiveCell coords={{ q, r }}>
      <ActiveTile {...{ creature: q + '-' + r, id: 0, playerId: 0, moves: [] as HexCoordinates[] }} />
    </ActiveCell>
  );

  describe('Hextille Snapshot', () => {
    test('matches current snapshot', () => {
      expect(
        render(
          <Hextille>
            <Row>{createCell}</Row>
          </Hextille>
        )
      ).toMatchSnapshot();
    });
  });
});
