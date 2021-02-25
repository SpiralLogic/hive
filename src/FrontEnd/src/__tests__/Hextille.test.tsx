import { HexCoordinates } from '../domain';
import { h } from 'preact';
import { renderElement } from './helpers';
import Hextille from '../components/Hextille';

describe('Hextille Tests', () => {
  const createCell = (q: number, r: number) => ({
    coords: { q, r },
    tiles: [
      {
        creature: q + '-' + r,
        id: 0,
        playerId: 0,
        moves: [] as HexCoordinates[],
      },
    ],
  });

  const createWithCells = (...coords: [number, number][]) => {
    const props: typeof Hextille.arguments.props = {
      cells: coords.map(([q, r]) => createCell(q, r)),
    };
    const hextille = renderElement(<Hextille {...props} />);
    const rows = document.body.getElementsByClassName('hex-row');
    const cells = document.body.getElementsByClassName('cell');
    const hidden = document.body.getElementsByClassName('hidden');

    return { rows, cells, hidden, hextille } as const;
  };

  describe('creation tests', () => {
    test('can be created with 1 cell', () => {
      const { rows, cells } = createWithCells([0, 0]);

      expect(cells).toHaveLength(1);
      expect(rows).toHaveLength(1);
    });

    test('r increases rows', () => {
      const { rows } = createWithCells([0, 0], [0, 1], [0, 2]);

      expect(rows).toHaveLength(3);
    });

    test('cells are sorted', () => {
      const { cells } = createWithCells([2, 0], [1, 0], [3, 0]);
      const cellUse = Array.from(cells).map((r) => r.querySelector('use.creature'));
      expect(cellUse[0]).toHaveAttribute('href', expect.stringContaining('1-0'));
      expect(cellUse[1]).toHaveAttribute('href', expect.stringContaining('2-0'));
      expect(cellUse[2]).toHaveAttribute('href', expect.stringContaining('3-0'));
    });

    test('rows are sorted', () => {
      const { rows } = createWithCells([0, 3], [0, 1], [0, 2]);
      const rowUse = Array.from(rows).map((r) => r.querySelector('use.creature'));
      expect(rowUse[0]).toHaveAttribute('href', expect.stringContaining('0-1'));
      expect(rowUse[1]).toHaveAttribute('href', expect.stringContaining('0-2'));
      expect(rowUse[2]).toHaveAttribute('href', expect.stringContaining('0-3'));
    });
  });

  describe('Row alignment', () => {
    test('shifts left when even rows have odd starting  index', () => {
      const { hextille } = createWithCells([0, 1], [0, 2], [0, 3]);

      expect(hextille.firstElementChild).toHaveClass('left');
    });

    test('shifts right when even rows have even starting index', () => {
      const { hextille } = createWithCells([0, 2], [0, 3], [0, 4]);

      expect(hextille.firstElementChild).toHaveClass('right');
    });
  });

  describe('Hextille Snapshot', () => {
    test('can move matches current snapshot', () => {
      expect(createWithCells([0, -2], [1, -2], [-1, 3], [0, 4], [5, 2], [3, 3], [1, 4])).toMatchSnapshot();
    });
  });
});
