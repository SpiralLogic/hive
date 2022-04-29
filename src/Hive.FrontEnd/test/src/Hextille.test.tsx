import { render } from '@testing-library/preact';
import GameCell from '../../src/components/GameCell';
import Hextille from '../../src/components/Hextille';
import Row from '../../src/components/Row';

describe('<Hextille>', () => {
  it('matches current snapshot', () => {
    expect(
      render(
        <Hextille>
          <Row>
            <GameCell coords={{ q: 0, r: 0 }} />
          </Row>
        </Hextille>
      )
    ).toMatchSnapshot();
  });
});
