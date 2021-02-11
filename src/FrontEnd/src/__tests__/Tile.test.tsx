import { HiveEvent } from '../emitters';
import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { handleKeyboardNav } from '../handlers';
import { renderElement, simulateEvent } from './helpers';
import { useHiveEventEmitter } from '../hooks';
import Tile from '../components/Tile';

describe('Tile', () => {
  const tileCanMove = {
    id: 1,
    playerId: 1,
    creature: 'ant',
    moves: [{ q: 1, r: 1 }],
  };
  const tileNoMove = { id: 2, playerId: 0, creature: 'fly', moves: [] };

  const createTileCanMove = () => {
    return renderElement(<Tile {...tileCanMove} />);
  };

  const createTileNoMove = () => {
    return renderElement(<Tile {...tileNoMove} />);
  };

  describe('Tile Render', () => {
    test('has creature', () => {
      expect(createTileNoMove().getElementsByTagName('use').item(0)).toHaveAttribute(
        'href',
        expect.stringContaining('fly')
      );
      expect(createTileCanMove().getElementsByTagName('use').item(0)).toHaveAttribute(
        'href',
        expect.stringContaining('ant')
      );
    });
  });

  describe('tile events', () => {
    test('click emits tile start event', () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      fireEvent.click(createTileCanMove());
      const expectedEvent: HiveEvent = {
        type: 'start',
        tile: tileCanMove,
      };

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('enter emits tile start event', () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      fireEvent.keyDown(createTileCanMove(), { key: 'Enter' });
      const expectedEvent: HiveEvent = {
        type: 'start',
        tile: tileCanMove,
      };

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('arrow keys use handler', () => {
      const tile = createTileCanMove();
      jest.spyOn(tile, 'focus');
      fireEvent.keyDown(tile, { key: 'ArrowDown' });

      expect(tile.focus).toHaveBeenCalled();
    });

    test('Space emits tile start event', () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      fireEvent.keyDown(createTileCanMove(), { key: ' ' });
      const expectedEvent: HiveEvent = {
        type: 'start',
        tile: tileCanMove,
      };

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('click deselects previous selected tile', () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      const tile = createTileCanMove();
      fireEvent.click(tile);
      fireEvent.click(createTileCanMove());

      const expectedEvent: HiveEvent = {
        type: 'deselect',
      };

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('clicking same tile keeps it active', () => {
      const mock = jest.spyOn(useHiveEventEmitter(), 'emit');
      const tile = createTileCanMove();
      fireEvent.click(tile);

      mock.mockClear();
      fireEvent.click(tile);

      expect(useHiveEventEmitter().emit).not.toHaveBeenCalled();
    });

    test('is draggable when there are available moves', () => {
      expect(createTileCanMove()).toHaveAttribute('draggable', 'true');
    });

    test('is *not* draggable when there are no moves available', () => {
      expect(createTileNoMove()).toHaveAttribute('draggable', 'false');
    });

    test('on drag emits start event', () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      fireEvent.dragStart(createTileCanMove());

      const expectedEvent: HiveEvent = {
        type: 'start',
        tile: tileCanMove,
      };

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('on dragEnd emits end event', () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      fireEvent.dragEnd(createTileCanMove());
      const expectedEvent: HiveEvent = {
        type: 'end',
        tile: tileCanMove,
      };

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('default on drop is prevented', () => {
      expect(simulateEvent(createTileCanMove(), 'drop')).toHaveBeenCalled();
      expect(simulateEvent(createTileNoMove(), 'drop')).toHaveBeenCalled();
    });
  });

  describe('Tile Snapshot', () => {
    test('can move matches current snapshot', () => {
      expect(createTileCanMove()).toMatchSnapshot();
    });

    test('no moves matches current snapshot', () => {
      expect(createTileNoMove()).toMatchSnapshot();
    });
  });
});
