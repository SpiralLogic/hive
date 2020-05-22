import { act, create, ReactTestRenderer } from 'react-test-renderer';
import * as React from 'react';
import { Hexagon, HexEngine, Player } from '../domain';
import * as TestUtils from 'react-dom/test-utils';
import { render } from 'react-dom';
import { GameArea } from '../components';

let props: { loading: boolean; players: Player[]; hexagons: Hexagon[]; };

beforeEach(() => {
    const hexagon = { coordinates: { q: 1, r: 1 }, tiles: [] };
    const player: Player = {
        id: 1,
        name: 'adsf',
        availableTiles: [{ id: 1, playerId: 1, availableMoves: [], content: 'ant', }],
    };

    const gameState = { hexagons: [hexagon], players: [player] };

    props = { players: [player], hexagons: [hexagon], loading: false };

});

test('Game area shows initial loading', () => {
    props.loading = true;
    const component = create(<GameArea {...props} />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
});

test('default on drop is prevented', async () => {
    await TestUtils.act(async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        render(<GameArea  {...props} />, container);
    });

    const gameArea = document.querySelectorAll('.hive')[0];
    const preventDefault = jest.fn();
    TestUtils.Simulate.dragOver(gameArea, { preventDefault });
    expect(preventDefault).toBeCalled();
});

test('Game area shows board after fetch', async () => {
    const component = create(<GameArea  {...props} />,);

    expect(component.toJSON()).toMatchSnapshot();
});

