import { render } from '@testing-library/preact';
import GameCell from '../../src/components/GameCell';
import Hextille from '../../src/components/Hextille';
import Row from '../../src/components/Row';

describe('<Hextille> snapshots', () => {
  it('matches', () => {
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
