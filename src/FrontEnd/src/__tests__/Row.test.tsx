import { h } from 'preact';
import { renderElement } from './helpers';
import { screen } from '@testing-library/preact';
import GameCell from '../components/GameCell';
import Row from '../components/Row';

describe('Row Tests', () => {
  const row = renderElement(
    <Row>
      <GameCell coords={{ q: 0, r: 1 }} hidden={true} />
      <GameCell coords={{ q: 1, r: 1 }} />
      <GameCell coords={{ q: 2, r: 1 }} />
      <GameCell coords={{ q: 0, r: 1 }} hidden={true} />
    </Row>
  );

  test('renders multiple cells', () => {
    expect(screen.getAllByRole('cell')).toHaveLength(2);
    expect(screen.getAllByRole('none')).toHaveLength(2);
  });

  test('snapshot', () => {
    expect(row).toMatchSnapshot();
  });
});
