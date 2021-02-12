import { deepEqual } from 'fast-equals';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import { renderElement } from './helpers';
import Row from '../components/Row';

require('@testing-library/jest-dom');
jest.mock('fast-equals');

let row: HTMLElement;

describe('Row Tests', () => {
  beforeEach(() => {
    type RowProps = typeof Row.arguments.props['row'];
    const cells: RowProps = [
      { coords: { q: 0, r: 1 }, tiles: [] },
      { coords: { q: 1, r: 1 }, tiles: [] },
      false,
    ];
    row = renderElement(<Row id={1} row={cells} />);
  });

  test('has class', () => {
    expect(row).toHaveClass('hex-row');
  });

  test('renders multiple cells', () => {
    expect(row.children).toHaveLength(3);
  });

  test('renders hidden div for missing cells', () => {
    expect(row.lastElementChild).toHaveClass('hidden');
  });

  test('is memoized with deep equal', () => {
    const props = { id: 1, row: [] };
    const row = <Row {...props} />;
    render(row).rerender(row);
    expect(deepEqual).toHaveBeenCalledTimes(1);
  });
  describe('Row snapshot tests', () => {
    test('Row snapshot', () => {
      expect(row).toMatchSnapshot();
    });
  });
});
