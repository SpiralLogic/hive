import { HiveAction, HiveEvent, TileEvent } from '../utilities/hive-dispatcher';
import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { renderElement, simulateEvent } from './helpers';
import { useHiveDispatcher } from '../utilities/hooks';
import GameTile from '../components/GameTile';

describe('Tile Tests', () => {
  const tileCanMove = {
    id: 1,
    playerId: 1,
    creature: 'ant',
    moves: [{ q: 1, r: 1 }],
  };
  const tileNoMove = { id: 2, playerId: 0, creature: 'fly', moves: [] };

  const createTileCanMove = () => {
    return renderElement(<GameTile {...tileCanMove} />);
  };

  const createTileNoMove = () => {
    return renderElement(<GameTile {...tileNoMove} />);
  };

  const expectedHiveEvent: HiveAction = {
    type: 'tileSelect',
    tile: tileCanMove,
  };

  describe('Tile render', () => {
    test('has creature', () => {
      expect(createTileNoMove().querySelectorAll('.creature')).toHaveLength(1);
      expect(createTileCanMove().querySelectorAll('.creature')).toHaveLength(1);
    });
  });

  describe('tile events', () => {
    test('click emits tile start event', () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.click(createTileCanMove());
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith(expect.objectContaining(expectedEvent));
    });

    test('enter emits tile start event', () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.keyDown(createTileCanMove(), { key: 'Enter' });
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith(expect.objectContaining(expectedEvent));
    });

    test('enter selects tile', () => {
      const tile = createTileCanMove();
      fireEvent.keyDown(tile, { key: 'Enter' });

      expect(tile).toHaveClass('selected');
    });

    test('second enter deselects tile', () => {
      const tile = createTileCanMove();
      fireEvent.keyDown(tile, { key: 'Enter' });
      fireEvent.keyDown(tile, { key: 'Enter' });

      expect(tile).not.toHaveClass('selected');
    });

    test('arrow keys use handler', () => {
      const tile = createTileCanMove();
      jest.spyOn(tile, 'focus');
      fireEvent.keyDown(tile, { key: 'ArrowDown' });

      expect(tile.focus).toHaveBeenCalled();
    });

    test('Space emits tile start event', () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.keyDown(createTileCanMove(), { key: ' ' });
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith(expect.objectContaining(expectedEvent));
    });

    test('click deselects previous selected tile', () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const tile = createTileCanMove();
      fireEvent.click(tile);

      expect(tile).toHaveClass('selected');
    });

    test('clicking same tile doesnt fire a tile start event', () => {
      const mock = jest.spyOn(useHiveDispatcher(), 'dispatch');
      const tile = createTileCanMove();
      fireEvent.click(tile);

      mock.mockClear();
      fireEvent.click(tile);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'tileSelect' })
      );
    });

    test('mouseLeave activates blur', () => {
      const tile = createTileCanMove();
      tile.focus();
      fireEvent.mouseLeave(tile);
      expect(tile).not.toHaveFocus();
    });

    test('is draggable when there are available moves', () => {
      expect(createTileCanMove()).toHaveAttribute('draggable', 'true');
    });

    test('is *not* draggable when there are no moves available', () => {
      expect(createTileNoMove()).toHaveAttribute('draggable', 'false');
    });

    test('on drag emits start event', () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.dragStart(createTileCanMove());
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith(expect.objectContaining(expectedEvent));
    });

    test('on dragEnd emits end event', () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.dragEnd(createTileCanMove());
      const expectedEvent: HiveEvent = {
        type: 'tileDropped',
        tile: tileCanMove,
      };

      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith(expect.objectContaining(expectedEvent));
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
