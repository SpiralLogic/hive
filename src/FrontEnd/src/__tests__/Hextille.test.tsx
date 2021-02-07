import { HexCoordinates } from '../domain';
import { h } from 'preact';
import { renderElement } from './helpers';
import Hextille from '../components/Hextille';

describe('Hextille', () => {
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

    describe('Hextille tests', () => {
        it('can be created with 1 cell', () => {
            const { rows, cells } = createWithCells([0, 0]);

            expect(cells).toHaveLength(1);
            expect(rows).toHaveLength(1);
        });

        it('r increases rows', () => {
            const { rows } = createWithCells([0, 0], [0, 1], [0, 2]);

            expect(rows).toHaveLength(3);
        });

        it('cells are sorted', () => {
            const { cells } = createWithCells([2, 0], [1, 0], [3, 0]);

            expect(cells[0].getElementsByTagName('use').item(0)).toHaveAttribute('href', expect.stringContaining('1-0'));
            expect(cells[1].getElementsByTagName('use').item(0)).toHaveAttribute('href', expect.stringContaining('2-0'));
            expect(cells[2].getElementsByTagName('use').item(0)).toHaveAttribute('href', expect.stringContaining('3-0'));
        });

        it('rows are sorted', () => {
            const { rows } = createWithCells([0, 3], [0, 1], [0, 2]);

            expect(rows[0].getElementsByTagName('use').item(0)).toHaveAttribute('href', expect.stringContaining('0-1'));
            expect(rows[1].getElementsByTagName('use').item(0)).toHaveAttribute('href', expect.stringContaining('0-2'));
            expect(rows[2].getElementsByTagName('use').item(0)).toHaveAttribute('href', expect.stringContaining('0-3'));
        });
    });

    describe('Row alignment', () => {
        it('shifts left when even rows have odd starting  index', () => {
            const { hextille } = createWithCells([0, 1], [0, 2], [0, 3]);

            expect(hextille.firstElementChild).toHaveClass('left');
        });

        it('shifts right when even rows have even starting index', () => {
            const { hextille } = createWithCells([0, 2], [0, 3], [0, 4]);

            expect(hextille.firstElementChild).toHaveClass('right');
        });
    });

    describe('Hextille Snapshot', () => {
        it('can move matches current snapshot', () => {
            expect(
                createWithCells([0, -2], [1, -2], [-1, 3], [0, 4], [5, 2], [3, 3], [1, 4])
            ).toMatchSnapshot();
        });
    });
});
