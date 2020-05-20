import {act, create, ReactTestRenderer} from 'react-test-renderer';
import * as React from 'react';
import {HexEngine, Player} from "../domain";
import * as TestUtils from "react-dom/test-utils";
import {render} from "react-dom";
import {GameArea} from "../components";

let engine: HexEngine;
let component: ReactTestRenderer;

beforeEach(() => {
    const hexagon = {coordinates: {q: 1, r: 1}, tiles: []};
    const player: Player = {
        id: 1,
        name: 'adsf',
        availableTiles: [{id: 1, playerId: 1, availableMoves: [], content: 'ant',}],
    };
    
    const gameState = {hexagons: [hexagon], players: [player]};
    engine = {
        initialState: jest.fn(async () => gameState),
        moveTile: jest.fn().mockResolvedValue(gameState)
    }
});

test('Game area shows initial loading', () => {
    component = create(<GameArea engine={engine}/>)
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
});

test('default on drop is prevented', async () => {
    await TestUtils.act(async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        render(<GameArea engine={engine}/>, container)
        await engine.initialState();
    });

    const gameArea = document.querySelectorAll('.hive')[0];
    const preventDefault = jest.fn();
    TestUtils.Simulate.dragOver(gameArea, {preventDefault});
    expect(preventDefault).toBeCalled();
});

test('Game area shows board after fetch', async () => {
    await act(async () => {
        component = create(<GameArea engine={engine}/>,)
        await engine.initialState();
    });

    expect(component.toJSON()).toMatchSnapshot();
});

