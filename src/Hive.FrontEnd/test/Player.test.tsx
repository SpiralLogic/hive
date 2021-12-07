import { fireEvent, render, screen } from '@testing-library/preact';
import { ComponentChild } from 'preact';
import Player from '../src/components/Player';
import GameTile from '../src/components/GameTile';
import { HexCoordinates } from '../src/domain';

describe('player Tests', () => {
  const createPlayer = (): [(ui: ComponentChild) => void, Element] => {
    const playerProperties = { id: 1, name: 'Player 1' };
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const { rerender } = render(
      <Player {...playerProperties}>
        <GameTile
          id={1}
          currentPlayer={1}
          playerId={1}
          creature={'thing'}
          moves={new Array<HexCoordinates>()}
        />
      </Player>
    );
    return [rerender, screen.getByTitle(/Player 1/)];
  };

  it('has rendered with player name', () => {
    createPlayer();
    expect(screen.getByText(/Player 1/)).toBeInTheDocument();
  });

  it('player is rendered with their tiles', () => {
    createPlayer();
    expect(screen.getByTitle(/Player-1/)).toBeInTheDocument();
  });

  it(`player is hidden when last tile is played`, async () => {
    jest.useFakeTimers();
    const [rerender] = createPlayer();
    expect(screen.getByTitle('Player 1')).not.toHaveClass('hide');

    rerender(<Player id={1} name="Player 1" />);
    jest.runAllTimers();

    expect(await screen.findByTitle('Player 1')).toHaveClass('hide');

    fireEvent.animationEnd(screen.getByTitle('Player 1'));

    // expect(screen.queryByTitle('Player 1')).not.toBeInTheDocument();
  });

  it('snapshot', () => {
    const [, player] = createPlayer();
    expect(player).toMatchSnapshot();
  });
});
