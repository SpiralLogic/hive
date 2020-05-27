import {render} from '@testing-library/preact';
import React from 'preact/compat';
import Hextille from '../components/Hextille';
import {useHiveContext} from '../game-context';
import Mock = jest.Mock;

jest.mock('../game-context');

const createCell = (q: number, r: number) => ({coordinates: {q, r}, tiles: []});
const create = (...coordinates: [number, number][]) => {
    (useHiveContext as Mock).mockReturnValue(({
        hexagons: coordinates.map(([q, r]) => createCell(q, r)),
        players: jest.fn(),
        moveTile: jest.fn()
    }));
    render(<Hextille/>).container.firstElementChild;
    const rows = document.body.getElementsByClassName('hex-row');
    const cells = document.body.getElementsByClassName('cell');
    const hidden = document.body.getElementsByClassName('hidden');
 
    return [rows, cells, hidden] as const;
};

describe('Hextille', () => {
    test('can be created with 1 cell', () => {
        const [rows, cells] = create([0,0]);
        
        expect(cells).toHaveLength(1);
        expect(rows).toHaveLength(1);
    });
    
    test('r increases rows', () => {
        const [rows] = create([0,0],[0,1],[0,2]);
        expect(rows).toHaveLength(3);
    });
});
