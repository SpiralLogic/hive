/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HiveEvent } from '../emitters';
import { RenderResult, fireEvent, render } from '@testing-library/preact';
import { h } from 'preact';
import { mockLocation, restoreLocation } from './helpers/location';
import { useHiveEventEmitter } from '../hooks';
import PlayerTiles from '../components/PlayerTiles';

describe('PlayerTiles', () => {
  const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
  const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

  const playerProps = { id: 1, name: 'Player 1', tiles: [ant, fly, fly] };

  let container: RenderResult;
  let playerTiles: Element | null;
  describe('PlayerTile tests', () => {
    beforeEach(() => {
      global.window.history.replaceState({}, global.document.title, `/game/33/1`);
      container = render(<PlayerTiles {...playerProps} />);
      playerTiles = document.getElementsByClassName('player').item(0);
    });

    test('playerTiles is rendered', () => {
      expect(playerTiles).not.toBeNull();
    });

    test('is rendered with playerTiles name', () => {
      const playerName = playerTiles?.querySelector('.name');

      expect(playerName).toHaveTextContent('Player 1');
      expect(playerName).not.toBeInstanceOf(HTMLAnchorElement);
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
      render(<PlayerTiles {...playerProps} />);
      const playerName = document.querySelector('.name');
      expect(playerName).not.toBeInstanceOf(HTMLAnchorElement);
    });

    test('nothing is rendered with no tiles left', () => {
      const emptyTileProps = { ...playerProps, tiles: [] };
      container = render(<PlayerTiles {...emptyTileProps} />);
      playerTiles = container.baseElement.getElementsByClassName('playerTiles').item(1);
      expect(playerTiles).toBeNull();
    });

    test('enter navigates player', () => {
      mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
      const playerName = render(<PlayerTiles {...playerProps} />).container.querySelector('.name');
      fireEvent.keyDown(playerName!, { key: 'Enter' });
      expect(window.location.href.endsWith('1')).toBe(true);
      restoreLocation();
    });

    test('space navigates player', () => {
      mockLocation({ href: '/game/33/0', pathname: '/game/33/0' });
      const playerName = render(<PlayerTiles {...playerProps} />).container.querySelector('.name');
      fireEvent.keyDown(playerName!, { key: ' ' });
      expect(window.location.href.endsWith('1')).toBe(true);
      restoreLocation();
    });
  });

  describe('PlayerTiles snapshot', () => {
    test('matches current snapshot', () => {
      expect(container.baseElement).toMatchSnapshot();
    });
  });
});
