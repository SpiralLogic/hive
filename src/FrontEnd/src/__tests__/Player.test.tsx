/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireEvent, render, screen } from '@testing-library/preact';
import { h } from 'preact';
import { mockLocation, restoreLocation } from './helpers/location';
import { renderElement } from './helpers';
import Player from '../components/Player';

describe('players Tests', () => {
  const playerProps = { id: 1, name: 'Player 1', show: false, currentPlayer: 1, onHidden: jest.fn() };

  let container: Element;
  let player: Element | null;
  describe('player tests', () => {
    beforeEach(() => {
      global.window.history.replaceState({}, global.document.title, `/game/33/1`);
      container = renderElement(<Player {...playerProps} />);
      player = document.getElementsByClassName('player').item(0);
    });

    it('player is rendered', () => {
      expect(player).not.toBeNull();
    });

    it('is rendered with player name', () => {
      const playerName = player?.querySelector('.name');

      expect(playerName).toHaveTextContent('Player 1');
    });

    it('player is rendered with their tiles', () => {
      const tiles = player?.getElementsByClassName('tiles');
      expect(tiles).toHaveLength(1);
    });

    it('nothing is rendered with no tiles left', () => {
      const emptyTileProps = { ...playerProps, tiles: [] };
      const container = renderElement(<Player {...emptyTileProps} />);
      player = container.getElementsByClassName('player').item(1);
      expect(player).toBeNull();
    });

    it(`player is hidden when last tile is played`, () => {
      jest.useFakeTimers();
      const player = render(<Player onHidden={jest.fn()} id={1} name="P1" />);
      expect(screen.getByTitle('P1')).not.toHaveClass('hide');
      player.rerender(<Player onHidden={jest.fn()} id={1} name="P1" />);

      jest.advanceTimersByTime(100);
      player.rerender(<Player onHidden={jest.fn()} id={1} name="P1" />);
      expect(screen.getByTitle('P1')).toHaveClass('hide');
    });

    it(`other keys dont navigates player`, () => {
      mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
      const playerName = renderElement(<Player {...playerProps} />).querySelector('.name');
      fireEvent.keyDown(playerName!, { key: 'Tab' });
      expect(window.location.href.endsWith('1')).not.toBe(true);
      restoreLocation();
    });
  });

  describe('players snapshot', () => {
    it('matches current snapshot', () => {
      expect(container).toMatchSnapshot();
    });
  });
});
