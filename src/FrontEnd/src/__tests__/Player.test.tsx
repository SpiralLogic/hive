/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { mockLocation, restoreLocation } from './helpers/location';
import { renderElement } from './helpers';
import Player from '../components/Player';

describe('PlayerTiles Tests', () => {
  const playerProps = { id: 1, name: 'Player 1', hide: false, currentPlayer: 1 };

  let container: Element;
  let playerTiles: Element | null;
  describe('PlayerTile tests', () => {
    beforeEach(() => {
      global.window.history.replaceState({}, global.document.title, `/game/33/1`);
      container = renderElement(<Player {...playerProps} />);
      playerTiles = document.getElementsByClassName('player').item(0);
    });

    test('playerTiles is rendered', () => {
      expect(playerTiles).not.toBeNull();
    });

    test('is rendered with playerTiles name', () => {
      const playerName = playerTiles?.querySelector('.name');

      expect(playerName).toHaveTextContent('Player 1');
    });

    test('player is rendered with their tiles', () => {
      const tiles = playerTiles?.getElementsByClassName('tiles');
      expect(tiles).toHaveLength(1);
    });

    test('nothing is rendered with no tiles left', () => {
      const emptyTileProps = { ...playerProps, tiles: [] };
      const container = renderElement(<Player {...emptyTileProps} />);
      playerTiles = container.getElementsByClassName('playerTiles').item(1);
      expect(playerTiles).toBeNull();
    });

    test(`other keys dont navigates player`, () => {
      mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
      const playerName = renderElement(<Player {...playerProps} />).querySelector('.name');
      fireEvent.keyDown(playerName!, { key: 'Tab' });
      expect(window.location.href.endsWith('1')).not.toBe(true);
      restoreLocation();
    });
  });

  describe('PlayerTiles snapshot', () => {
    test('matches current snapshot', () => {
      expect(container).toMatchSnapshot();
    });
  });
});
