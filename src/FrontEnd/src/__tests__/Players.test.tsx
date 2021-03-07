import { h } from 'preact';
import { renderElement } from './helpers';
import Players from '../components/Players';

describe('PlayerList Tests', () => {
  const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
  const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

  const players = [
    { id: 1, name: 'Player 1', tiles: [ant, fly, fly] },
    { id: 2, name: 'Player 2', tiles: [ant] },
  ];

  let playerList: HTMLElement;
  beforeEach(() => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    playerList = renderElement(<Players players={players} currentPlayer={0} />);
  });

  test('to have class', () => {
    expect(playerList).toHaveClass('players');
  });

  test('players are rendered', () => {
    expect(playerList.getElementsByClassName('player')).toHaveLength(2);
  });

  describe('PlayerList snapshot', () => {
    test('matches current snapshot', () => {
      expect(playerList).toMatchSnapshot();
    });
  });
});
