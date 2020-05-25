import {Hexagon, Player} from '../domain';
import {GameArea} from '../components';
import * as CTX from '../game-context';
import {fireEvent, render} from '@testing-library/preact';
import * as React from 'preact/compat';

function simulateEvent(target: HTMLElement, type: string) {
    const preventDefault = jest.fn();
    const e = new MouseEvent(type, {bubbles: true});
    Object.assign(e, {preventDefault});
    fireEvent(target, e);

    return preventDefault;
}

let props: { loading: boolean; players: Player[]; hexagons: Hexagon[] };

beforeEach(() => {
    const hexagon = {coordinates: {q: 1, r: 1}, tiles: []};
    const player: Player = {
        id: 1,
        name: 'adsf',
        availableTiles: [{id: 1, playerId: 1, availableMoves: [], content: 'ant'}],
    };

    const gameState = {hexagons: [hexagon], players: [player]};

    props = {players: [player], hexagons: [hexagon], loading: false};
    jest.spyOn(CTX, 'useHiveContext').mockImplementation(() => ({moveTile: jest.fn(), ...gameState}));
});

test('Game area shows loading', async () => {
    expect(render(<GameArea loading={true}/>).baseElement).toMatchSnapshot();
});

test('default on drop is prevented', async () => {
    render(<GameArea loading={false}/>);
    const gameArea = document.querySelector<HTMLDivElement>('.hive');

    const preventDefault = simulateEvent(gameArea!, 'dragover');
    expect(preventDefault).toHaveBeenCalled();
});

test('Game area shows board after fetch', async () => {
    expect(render(<GameArea loading={false}/>).baseElement).toMatchSnapshot();
});
