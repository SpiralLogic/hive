import GameCell from '../src/components/GameCell';
import Hextille from '../src/components/Hextille';
import Row from '../src/components/Row';
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
