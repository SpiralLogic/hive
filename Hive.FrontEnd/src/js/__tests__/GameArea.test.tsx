import { create } from 'react-test-renderer';
import * as React from 'react';
import { Hexagon,  Player } from '../domain';
import * as TestUtils from 'react-dom/test-utils';
import { render } from 'react-dom';
import { GameArea } from '../components';
import * as CTX from '../game-context';
import { HiveContext } from '../game-context';
let props: { loading: boolean; players: Player[]; hexagons: Hexagon[] };

beforeEach(() => {
    const hexagon = { coordinates: { q: 1, r: 1 }, tiles: [] };
    const player: Player = {
        id: 1,
        name: 'adsf',
        availableTiles: [{ id: 1, playerId: 1, availableMoves: [], content: 'ant' }],
    };

    const gameState = { hexagons: [hexagon], players: [player] };

    props = { players: [player], hexagons: [hexagon], loading: false };
    jest.spyOn(CTX, 'useHiveContext').mockImplementation(() => ({ moveTile: jest.fn(), ...gameState }));
});

test('Game area shows initial loading', () => {
    props.loading = true;
    const component = create(<GameArea loading={true} />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
});

test('default on drop is prevented', async () => {
    await TestUtils.act(async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        render(
            <HiveContext.Provider value={CTX.useHiveContext()}>
                <GameArea loading={false} />
            </HiveContext.Provider>,
            container,
        );
    });

    const gameArea = document.querySelectorAll('.hive')[0];
    const preventDefault = jest.fn();
    TestUtils.Simulate.dragOver(gameArea, { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
});

test('Game area shows board after fetch', async () => {
    const component = create(<GameArea loading={false} />);

    expect(component.toJSON()).toMatchSnapshot();
});
