import { h } from 'preact';
import { renderElement } from './helpers';
import Cell from '../components/Cell';
import Row from '../components/Row';

require('@testing-library/jest-dom');
jest.mock('fast-equals');

let row: HTMLElement;

describe('Row Tests', () => {
  beforeEach(() => {
    const cells = [
      { coords: { q: 0, r: 1 }, tiles: [], isHidden: true },
      { coords: { q: 0, r: 1 }, tiles: [] },
      { coords: { q: 1, r: 1 }, tiles: [] },
      { coords: { q: 0, r: 1 }, tiles: [], isHidden: true },
    ];
    row = renderElement(
      <Row
        children={cells.map((c) => (
          <Cell {...c} />
        ))}
      />
    );
  });

  test('renders multiple cells', () => {
    expect(row.children).toHaveLength(4);
  });

  describe('Row snapshot tests', () => {
    test('Row snapshot', () => {
      expect(row).toMatchSnapshot();
    });
  });
});
