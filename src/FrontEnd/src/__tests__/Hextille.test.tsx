import { h } from 'preact';
import { renderElement } from './test-helpers';
import GameCell from '../components/GameCell';
import Hextille from '../components/Hextille';
import Row from '../components/Row';

describe('Hextille Tests', () => {
  test('matches current snapshot', () => {
    expect(
      renderElement(
        <Hextille>
          <Row>
            <GameCell coords={{ q: 0, r: 0 }} />
          </Row>
        </Hextille>
      )
    ).toMatchSnapshot();
  });
});
