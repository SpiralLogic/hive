import { h } from 'preact';
import PlayerList from '../components/PlayerList';
import { renderElement } from './helpers';

const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

const players = [
    { id: 1, name: 'Player 1', tiles: [ant, fly, fly] },
    { id: 2, name: 'Player 2', tiles: [ant] },
];

const props = { players: players };
let playerList: HTMLElement;

beforeEach(() => {
    playerList = renderElement(<PlayerList {...props} />);
});

describe('Player List', () => {
    test('to have class', () => {
        expect(playerList).toHaveClass('players');
    });

    test('players are rendered', () => {
        expect(playerList.getElementsByClassName('player')).toHaveLength(2);
    });
});

describe('PlayerList snapshot', () => {
    test('matches current snapshot', () => {
        expect(playerList).toMatchSnapshot();
    });
});
