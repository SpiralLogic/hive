import { deepEqual } from 'fast-equals';
import { h } from 'preact';
import { render } from '@testing-library/preact';
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

  test('has class', () => {
    expect(row).toHaveClass('hex-row');
  });

  test('renders multiple cells', () => {
    expect(row.children).toHaveLength(4);
  });

  test('is memoized with deep equal', () => {
    const row = <Row children={{ id: 1, row: [] }} />;
    render(row).rerender(row);
    expect(deepEqual).toHaveBeenCalledTimes(1);
  });
  describe('Row snapshot tests', () => {
    test('Row snapshot', () => {
      expect(row).toMatchSnapshot();
    });
  });
});
