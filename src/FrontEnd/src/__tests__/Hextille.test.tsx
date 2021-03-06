import { HexCoordinates } from '../domain';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import GameCell from '../components/GameCell';
import GameTile from '../components/GameTile';
import Hextille from '../components/Hextille';
import Row from '../components/Row';

describe('Hextille Tests', () => {
  const createCell = (q: number, r: number) => (
    <GameCell coords={{ q, r }}>
      <GameTile {...{ creature: q + '-' + r, id: 0, playerId: 0, moves: [] as HexCoordinates[] }} />
    </GameCell>
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
