import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import Players from '../src/components/Players';

describe('playerList Tests', () => {
  const playerList = () => {
    const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
    const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

    const players = [
      { id: 1, name: 'Player 1', tiles: [ant, fly, fly] },
      { id: 2, name: 'Player 2', tiles: [ant] },
    ];

    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    return render(<Players currentPlayer={0} players={players} />).baseElement;
  };

  it('players are rendered', () => {
    playerList();
    expect(screen.getAllByTitle(/^Player [0-9]$/)).toHaveLength(2);
  });

  it('snapshot', () => {
    expect(playerList()).toMatchSnapshot();
  });
});
