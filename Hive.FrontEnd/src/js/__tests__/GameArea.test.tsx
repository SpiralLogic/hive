import {GameArea} from '../components';
import {fireEvent, render} from '@testing-library/preact';
import { h } from 'preact';
import { simulateEvent } from './helpers/helpers';

jest.mock('../components/Hextille', () => () => (<div class="hextille"/>));

test('default on drop is prevented', async () => {
    const gameArea = render(<GameArea/>).container.firstElementChild as HTMLElement;

    const preventDefault = simulateEvent(gameArea, 'dragover');
    expect(preventDefault).toHaveBeenCalled();
});

test('Game area shows board after fetch', async () => {
    expect(render(<GameArea/>).container).toMatchSnapshot();
});
