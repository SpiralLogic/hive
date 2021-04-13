import { render, screen } from '@testing-library/preact';
import { ComponentChild, h } from 'preact';
import Player from '../src/components/Player';
import GameTile from '../src/components/GameTile';
import { HexCoordinates } from '../src/domain';

describe('player Tests', () => {
  const createPlayer = (): [(ui: ComponentChild) => void, Element] => {
    const playerProps = { id: 1, name: 'Player 1', show: false, currentPlayer: 1, onHidden: jest.fn() };
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const { rerender } = render(
      <Player {...playerProps}>
        <GameTile id={1} currentPlayer={1} playerId={1} creature={'thing'} moves={Array<HexCoordinates>()} />
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

  it(`player is hidden when last tile is played`, () => {
    jest.useFakeTimers();
    const [rerender] = createPlayer();
    expect(screen.getByTitle('Player 1')).not.toHaveClass('hide');
    rerender(<Player onHidden={jest.fn()} id={1} name="P1" />);

    jest.advanceTimersByTime(100);
    rerender(<Player onHidden={jest.fn()} id={1} name="P1" />);
    expect(screen.getByTitle('P1')).toHaveClass('hide');
  });

  it('snapshot', () => {
    const [, player] = createPlayer();
    expect(player).toMatchSnapshot();
  });
});
