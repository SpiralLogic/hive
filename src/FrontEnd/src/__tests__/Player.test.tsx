/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireEvent, render, screen } from '@testing-library/preact';
import { h } from 'preact';
import { mockLocation, restoreLocation } from './helpers/location';
import { renderElement } from './helpers';
import Player from '../components/Player';

describe('Players Tests', () => {
    const playerProps = { id: 1, name: 'Player 1', show: false, currentPlayer: 1 };

    let container: Element;
    let players: Element | null;
    describe('Player tests', () => {
        beforeEach(() => {
            global.window.history.replaceState({}, global.document.title, `/game/33/1`);
            container = renderElement(<Player {...playerProps} />);
            players = document.getElementsByClassName('player').item(0);
        });

        test('players is rendered', () => {
            expect(players).not.toBeNull();
        });

        test('is rendered with players name', () => {
            const playerName = players?.querySelector('.name');

            expect(playerName).toHaveTextContent('Player 1');
        });

        test('player is rendered with their tiles', () => {
            const tiles = players?.getElementsByClassName('tiles');
            expect(tiles).toHaveLength(1);
        });

        test('nothing is rendered with no tiles left', () => {
            const emptyTileProps = { ...playerProps, tiles: [] };
            const container = renderElement(<Player {...emptyTileProps} />);
            players = container.getElementsByClassName('players').item(1);
            expect(players).toBeNull();
        });

        test(`player is hidden when last tile is played`, () => {
            jest.useFakeTimers();
            const player = render(<Player show={true} id={1} name="P1"/>);
            expect(screen.getByTitle('P1')).not.toHaveClass('hide');
            player.rerender(<Player show={false} id={1} name="P1"/>);

            expect(screen.getByTitle('P1')).toHaveClass('hiding');
            jest.advanceTimersByTime(100);
            player.rerender(<Player show={false} id={1} name="P1"/>);
            expect(screen.getByTitle('P1')).toHaveClass('hide');
        });

        test(`other keys dont navigates player`, () => {
                mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
                const playerName = renderElement(<Player {...playerProps} />).querySelector('.name');
                fireEvent.keyDown(playerName!, { key: 'Tab' });
                expect(window.location.href.endsWith('1')).not.toBe(true);
                restoreLocation();
            }
        )
        ;
    });

    describe('Players snapshot', () => {
        test('matches current snapshot', () => {
            expect(container).toMatchSnapshot();
        });
    });
});
