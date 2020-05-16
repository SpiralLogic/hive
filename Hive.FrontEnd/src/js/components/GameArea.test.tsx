import { GameArea } from './GameArea';
import { act, create } from 'react-test-renderer';
import * as React from 'react';
import { Hexagon } from '../domain';

jest.mock('../domain/engine');
const hexagon: Hexagon = { coordinates: { q: 1, r: 1 }, tiles: [] };
const gameState = Promise.resolve({ hexagons: [hexagon], players: [] });

test('Game area shows loading', () => {
    const state = jest.fn().mockImplementation(() => gameState);
    const move = jest.fn().mockImplementation(() => gameState);

    const engine = { initialState: state, moveTile: move };
    const component = create(<GameArea engine={engine}/>);
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
});

test('Game shows board after fetch', async () => {
    const state = jest.fn().mockImplementation(() => gameState);
    const move = jest.fn().mockImplementation(() => gameState);

    const engine = { initialState: state, moveTile: move };
    const component = create(<GameArea engine={engine}/>);

    await act(async () => { await state;});
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
});
