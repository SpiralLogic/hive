import { h } from 'preact';
import GameCell from '../components/GameCell';
import Hextille from '../components/Hextille';
import Row from '../components/Row';
import { renderElement } from './test-helpers';

describe('hextille Tests', () => {
  it('matches current snapshot', () => {
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
