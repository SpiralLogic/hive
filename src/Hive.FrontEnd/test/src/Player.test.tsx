import { fireEvent, render, screen } from '@testing-library/preact';
import Player from '../../src/components/Player';
import GameTile from '../../src/components/GameTile';
import { HexCoordinates } from '../../src/domain';

const setUp = () => {
  global.window.history.replaceState({}, global.document.title, `/game/33/1`);
  const playerProperties = { id: 1, name: 'Player 1' };
  return render(
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
};

describe('<Player>', () => {
  it('has rendered with player name', () => {
    setUp();
    expect(screen.getByRole('heading')).toHaveTextContent(/Player 1/);
  });

  it('player is rendered with their tiles', () => {
    setUp();
    expect(screen.getByTitle(/Player-1/)).toBeInTheDocument();
  });

  it(`player is hidden when last tile is played`, async () => {
    vi.useFakeTimers();

    const { rerender } = setUp();

    expect(screen.getByLabelText(/player 1/i)).not.toHaveClass('hide');

    rerender(<Player id={1} name="Player 1" />);
    vi.runAllTimers();

    expect(await screen.findByLabelText(/player 1/i)).toHaveClass('hide');

    fireEvent.transitionEnd(screen.getByLabelText(/player 1/i));

    expect(screen.queryByLabelText(/player 1/i)).toHaveClass('hidden');
  });

  it('renders', () => {
    expect(setUp()).toMatchSnapshot();
  });
});
