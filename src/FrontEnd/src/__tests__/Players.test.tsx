import { h } from 'preact';
import Players from '../components/Players';
import { renderElement } from './test-helpers';

describe('playerList Tests', () => {
  const renderPlayerList = () => {
    const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
    const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

    const players = [
      { id: 1, name: 'Player 1', tiles: [ant, fly, fly] },
      { id: 2, name: 'Player 2', tiles: [ant] },
    ];

    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    return renderElement(<Players players={players} />);
  };

  it('to have class', () => {
    const playerList = renderPlayerList();
    expect(playerList).toHaveClass('players');
  });

  it('players are rendered', () => {
    const playerList = renderPlayerList();
    expect(playerList.getElementsByClassName('player')).toHaveLength(2);
  });

  it('snapshot', () => {
    const playerList = renderPlayerList();
    expect(playerList).toMatchSnapshot();
  });
});
