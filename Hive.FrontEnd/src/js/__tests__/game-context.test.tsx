import {useHiveContext, useNewHiveContext} from '../game-context';
import {render} from '@testing-library/preact';
import React from 'preact/compat';
import Engine from '../game-engine';
import Mock = jest.Mock;

jest.mock('../game-engine', () => ({
    initialState: jest.fn().mockResolvedValue({hexagons: [], players: []}),
    moveTile: jest.fn().mockResolvedValue({}),
}));

let newContext: typeof useNewHiveContext.arguments;
let currentContext: typeof useHiveContext.arguments;
const TestContext = () => {
    newContext = useNewHiveContext();
    return <div/>;
};
const ContextConsumer = () => {
    currentContext = useHiveContext();
    return <div/>;
};
describe('Game Engine', () => {
    test('context starts in loading state', async () => {
        render(<TestContext/>);
        expect(newContext).toStrictEqual([true]);
    });

    test('context is populated after initial load', async () => {
        render(<TestContext/>);
        await Engine.initialState();

        expect(newContext[0]).toBe(false);
        expect(newContext[1]).toHaveProperty('hexagons');
        expect(newContext[1]).toHaveProperty('players');
        expect(newContext[1]).toHaveProperty('moveTile');
    });

    test('can send move request', async () => {
        render(<TestContext/>);
        await Engine.initialState();
        const [, ctx] = newContext;
        await ctx.moveTile(2, {q: 1, r: 1});

        expect(Engine.moveTile).toHaveBeenCalledTimes(1);
    });

    test('fetch initial fails', async () => {
        (Engine.initialState as Mock).mockRejectedValueOnce('test error');
        render(<TestContext/>);
        await Engine.initialState;
        expect(newContext).toStrictEqual([true]);
    });

    test('moveTile default is empty', async () => {
        render(<ContextConsumer/>);
        const {moveTile} = currentContext;
        moveTile(2, {q: 1, r: 1});
        expect(Engine.moveTile).not.toBeCalled();
    });

    test('fetch move fails', async () => {
        (Engine.moveTile as Mock).mockRejectedValueOnce('test error');
        render(<TestContext/>);
        render(<ContextConsumer/>);
        await Engine.initialState;
        const {moveTile} = currentContext;
        moveTile(2, {q: 1, r: 1});
        await Engine.moveTile;

        expect(currentContext).not.toBeNull();
    });

});