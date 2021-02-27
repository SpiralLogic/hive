/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RenderResult, fireEvent, render } from '@testing-library/preact';
import { h } from 'preact';
import { mockLocation, restoreLocation } from './helpers/location';
import { renderElement } from './helpers';
import PlayerTiles from '../components/PlayerTiles';

describe('PlayerTiles Tests', () => {
  const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
  const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

  const playerProps = { id: 1, name: 'Player 1', tiles: [ant, fly, fly] };

  let container: Element;
  let playerTiles: Element | null;
  describe('PlayerTile tests', () => {
    beforeEach(() => {
      global.window.history.replaceState({}, global.document.title, `/game/33/1`);
      container = renderElement(<PlayerTiles {...playerProps} />);
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

    test('each tile is rendered', () => {
      expect(playerTiles?.querySelectorAll('[title="ant"]')).toHaveLength(1);
      expect(playerTiles?.querySelectorAll('[title="fly"]')).toHaveLength(2);
    });

    test(`other player name is a link`, () => {
      global.window.history.replaceState({}, global.document.title, `/game/33/0`);
      renderElement(<PlayerTiles {...playerProps} />);
      const playerName = document.querySelector('.name');
      expect(playerName).toBeInstanceOf(HTMLAnchorElement);
    });

    test('nothing is rendered with no tiles left', () => {
      const emptyTileProps = { ...playerProps, tiles: [] };
      const container = renderElement(<PlayerTiles {...emptyTileProps} />);
      playerTiles = container.getElementsByClassName('playerTiles').item(1);
      expect(playerTiles).toBeNull();
    });

    test('enter navigates player', () => {
      mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
      const playerName = renderElement(<PlayerTiles {...playerProps} />).querySelector('.name');
      fireEvent.keyDown(playerName!, { key: 'Enter' });
      expect(window.location.href.endsWith('1')).toBe(true);
      restoreLocation();
    });

    test(`other keys dont navigates player`, () => {
      mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
      const playerName = renderElement(<PlayerTiles {...playerProps} />).querySelector('.name');
      fireEvent.keyDown(playerName!, { key: 'Tab' });
      expect(window.location.href.endsWith('1')).not.toBe(true);
      restoreLocation();
    });

    test('space navigates player', () => {
      mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
      const playerName = renderElement(<PlayerTiles {...playerProps} />).querySelector('.name');
      fireEvent.keyDown(playerName!, { key: ' ' });
      expect(window.location.href.endsWith('1')).toBe(true);
      restoreLocation();
    });
  });

  describe('PlayerTiles snapshot', () => {
    test('matches current snapshot', () => {
      expect(container).toMatchSnapshot();
    });
  });
});
