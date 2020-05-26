import {render} from '@testing-library/preact';
import PlayerList from '../components/PlayerList';
import {Hexagon} from '../domain';
import React from 'preact/compat';

const ant = {id: 1, playerId: 1, content: 'ant', availableMoves: [{q: 1, r: 1}]};
const fly = {id: 2, playerId: 0, content: 'fly', availableMoves: []};

const players = [
    {id: 1, name: 'Player 1', availableTiles: [ant, fly, fly]},
    {id: 2, name: 'Player 2', availableTiles: [ant]}
];

const context = {hexagons: [] as Hexagon[], players: players, moveTile: jest.fn()};

jest.mock('../game-context', () => ({useHiveContext: () => context}));

let playerList: HTMLCollectionOf<Element>;

beforeEach(() => {
    render(<PlayerList/>);
    playerList = document.getElementsByClassName('players');
});

describe('Player List', () => {
    test('players are rendered', () => {
        expect(playerList).toHaveLength(1);
        expect(playerList[0].children).toHaveLength(2);
    });
});

describe('snapshot', () => {
    test('matches current snapshot', () => {
        expect(playerList).toMatchSnapshot();
    });
});