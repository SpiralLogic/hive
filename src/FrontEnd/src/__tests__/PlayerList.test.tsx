import {h} from 'preact';
import {renderElement} from './helpers';
import PlayerList from '../components/PlayerList';


describe('Player List', () => {
    const ant = {id: 1, playerId: 1, creature: 'ant', moves: [{q: 1, r: 1}]};
    const fly = {id: 2, playerId: 0, creature: 'fly', moves: []};

    const players = [
        {id: 1, name: 'Player 1', tiles: [ant, fly, fly]},
        {id: 2, name: 'Player 2', tiles: [ant]},
    ];

    const props = {players: players};
    let playerList: HTMLElement;
    beforeEach(() => {
        const location = window.location;
        // @ts-ignore
        delete global.window.location;
        // @ts-ignore
        global.window.location = {...location, pathname: '/game/33/0'};
        playerList = renderElement(<PlayerList {...props} />);
    });

    describe('PlayerList tests', () => {
        test('to have class', () => {
            expect(playerList).toHaveClass('players');
        });

        test('players are rendered', () => {
            expect(playerList.getElementsByClassName('player')).toHaveLength(2);
        });
    });

    describe('PlayerList snapshot', () => {
        test('matches current snapshot', () => {
            expect(playerList).toMatchSnapshot();
        });
    });

});
