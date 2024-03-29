import { render, screen } from '@testing-library/preact';
import GameCell from '../../src/components/GameCell';
import Row from '../../src/components/Row';

const setup = () =>
  render(
    <Row>
      <GameCell coords={{ q: 0, r: 1 }} hidden={true} />
      <GameCell coords={{ q: 1, r: 1 }} />
      <GameCell coords={{ q: 2, r: 1 }} />
      <GameCell coords={{ q: 0, r: 1 }} hidden={true} />
    </Row>
  );

describe('<Row>', () => {
  it('renders multiple cells', () => {
    setup();
    expect(screen.getAllByRole('cell')).toHaveLength(2);
    expect(screen.getAllByRole('none')).toHaveLength(2);
  });
});

describe('<Row> snapshots', () => {
  it('matches', () => {
    setup();
    expect(screen.getByRole('row')).toMatchSnapshot();
  });
});
