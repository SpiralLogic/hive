import {RenderResult, render} from '@testing-library/preact';
import {h} from 'preact';
import PlayerTiles from '../components/PlayerTiles';

describe('PlayerTiles', () => {
    const ant = {id: 1, playerId: 1, creature: 'ant', moves: [{q: 1, r: 1}]};
    const fly = {id: 2, playerId: 0, creature: 'fly', moves: []};

    const playerProps = {id: 1, name: 'Player 1', tiles: [ant, fly, fly]};

    let container: RenderResult;
    let playerTiles: Element|null;
    describe('PlayerTile tests', () => {

        beforeEach(() => {
            container = render(<PlayerTiles {...playerProps} />);
            playerTiles = document.getElementsByClassName('player').item(0);
        });

        test('playerTiles is rendered', () => {
            expect(playerTiles).not.toBeNull();
        });

        test('is rendered with playerTiles name', () => {
            expect(playerTiles?.querySelector('.name')).toHaveTextContent('Player 1');
        });

        test('playerTiles is rendered with their tiles', () => {
            const tiles = playerTiles?.getElementsByClassName('tiles');
            expect(tiles).toHaveLength(1);
        });

        test('each tile is rendered', () => {
            expect(playerTiles?.querySelectorAll('[title="ant"]')).toHaveLength(1);
            expect(playerTiles?.querySelectorAll('[title="fly"]')).toHaveLength(2);
        })

        test('nothing is rendered with no tiles left', () => {
            const emptyTileProps = {...playerProps, tiles: []}
            container = render(<PlayerTiles {...emptyTileProps} />);
            playerTiles = container.baseElement.getElementsByClassName('playerTiles').item(1);
            expect(playerTiles).toBeNull();
        });
    });

    describe('PlayerTiles snapshot', () => {
        test('matches current snapshot', () => {
            expect(container.baseElement).toMatchSnapshot();
        });
    });
});
