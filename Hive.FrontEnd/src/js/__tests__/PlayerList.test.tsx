import { render } from '@testing-library/preact';
import { h } from 'preact';
import PlayerList from '../components/PlayerList';
import { Hexagon } from '../domain';

const ant = { id: 1, playerId: 1, content: 'ant', availableMoves: [{ q: 1, r: 1 }] };
const fly = { id: 2, playerId: 0, content: 'fly', availableMoves: [] };

const players = [
    { id: 1, name: 'Player 1', availableTiles: [ant, fly, fly] },
    { id: 2, name: 'Player 2', availableTiles: [ant] }
];

const context = { hexagons: [] as Hexagon[], players: players, moveTile: jest.fn() };

jest.mock('../game-context', () => ({ useHiveContext: () => context }));

let playerList: HTMLElement;

beforeEach(() => {
    playerList = render(<PlayerList/>).container.firstElementChild as HTMLElement;
});

describe('Player List', () => {
    test('to have class', () => {
        expect(playerList).toHaveClass('players');
    });

    test('players are rendered', () => {
        expect(playerList.getElementsByClassName('player')).toHaveLength(2);
    });
});

describe('snapshot', () => {
    test('matches current snapshot', () => {
        expect(playerList).toMatchSnapshot();
    });
});
