import {RenderResult, render} from '@testing-library/preact';
import {h} from 'preact';
import PlayerTiles from '../components/PlayerTiles';

describe('PlayerTiles', () => {
    const ant = {id: 1, playerId: 1, creature: 'ant', moves: [{q: 1, r: 1}]};
    const fly = {id: 2, playerId: 0, creature: 'fly', moves: []};

    const playerProps = {id: 1, name: 'Player 1', tiles: [ant, fly, fly]};

    let container: RenderResult;
    let player: Element;
    describe('PlayerTile tests', () => {

        beforeEach(() => {
            container = render(<PlayerTiles {...playerProps} />);
            player = document.getElementsByClassName('player').item(0)!;
        });

        test('player is rendered', () => {
            expect(player).not.toBeNull();
        });

        test('is rendered with player name', () => {
            expect(player.querySelector('.name')).toHaveTextContent('Player 1');
        });

        test('player is rendered with their tiles', () => {
            const playerTiles = player.getElementsByClassName('tiles');
            expect(playerTiles).toHaveLength(1);
        });

        test('each tile is rendered', () => {
            expect(player.querySelectorAll('[title="ant"]')).toHaveLength(1);
            expect(player.querySelectorAll('[title="fly"]')).toHaveLength(2);
        });
    });

    describe('PlayerTiles snapshot', () => {
        test('matches current snapshot', () => {
            expect(container.baseElement).toMatchSnapshot();
        });
    });
});
