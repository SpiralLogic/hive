import {GameArea} from './GameArea';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import * as React from 'react';
import {HexEngine} from "../domain";

let engine: HexEngine;
let component: ReactTestRenderer;

beforeEach(() => {
    const hexagon = {coordinates: {q: 1, r: 1}, tiles: []};
    const gameState = {hexagons: [hexagon], players: []};
    engine = {
        initialState: jest.fn(async () => gameState),
        moveTile: jest.fn().mockResolvedValue(gameState)
    }
});

test('Game area shows initial loading', () => {
    component = create(<GameArea engine={engine}/>)
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
})
;

test('Game area shows board after fetch', async () => {
    await act(async () => {
        component = create(<GameArea engine={engine}/>, )
        await engine.initialState();
    });

    expect(component.toJSON()).toMatchSnapshot();
});

