import {render} from '@testing-library/preact';
import { h } from 'preact';
import {useHiveContext, useNewHiveContext} from '../game-context';
import App from '../components/App';
import Mock = jest.Mock;

jest.mock('../game-context', () => {
    const emptyCell = {coordinates: {q: 0, r: 0}, tiles: []};
    const player = {id: 2, name: 'Player 2', availableTiles: []};
    const context = {hexagons: [emptyCell], players: [player], moveTile: jest.fn()};
    return {
        useNewHiveContext: jest.fn(),
        useHiveContext: jest.fn(),
        HiveContext: context
    };
});

test('new context is created', () => {
    (useNewHiveContext as Mock).mockReturnValue([true, undefined]);
    render(<App/>);
    expect(useNewHiveContext).toHaveBeenCalled();
});

test('renders game area with context', () => {
    const emptyCell = {coordinates: {q: 0, r: 0}, tiles: []};
    const player = {id: 2, name: 'Player 2', availableTiles: []};
    const context = {hexagons: [emptyCell], players: [player], moveTile: jest.fn()};
    (useNewHiveContext as Mock).mockReturnValue([false, context]);
    (useHiveContext as Mock).mockReturnValue(context);
    render(<App/>);
    expect(document.querySelectorAll('.hive')).toHaveLength(1);
});

test('shows loading', async () => {
    (useNewHiveContext as Mock).mockReturnValue([true, undefined]);
    expect(render(<App/>).container).toMatchSnapshot();
});

test('shows error when context is missing', async () => {
    (useNewHiveContext as Mock).mockReturnValue([false, undefined]);
    expect(render(<App/>).container).toMatchSnapshot();
});

test('shows game when loaded', async () => {
    expect(render(<App/>).container).toMatchSnapshot();
});
