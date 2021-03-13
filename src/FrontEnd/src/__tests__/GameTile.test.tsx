import { HiveEvent, TileAction, TileEvent } from '../services';
import { act, fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { renderElement, simulateEvent } from './helpers';
import { useHiveDispatcher } from '../utilities/hooks';
import GameTile from '../components/GameTile';

describe('tile Tests', () => {
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

  const createEmitter = (): [TileEvent[], () => void] => {
    const tileEvents: TileEvent[] = [];
    const listener = (e: TileEvent) => tileEvents.push(e);

    const emitter = useHiveDispatcher();
    const cleanup = emitter.add<TileEvent>('tileSelected', listener);
    return [tileEvents, cleanup];
  };

  describe('tile render', () => {
    test('has creature', () => {
      expect(createTileNoMove().querySelectorAll('.creature')).toHaveLength(1);
      expect(createTileCanMove().querySelectorAll('.creature')).toHaveLength(1);
    });
  });

  describe('tile events', () => {
    test('click emits tile start event', () => {
      const [tileEvents, cleanup] = createEmitter();
      fireEvent.click(createTileCanMove());
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    test('enter emits tile start event', () => {
      const [tileEvents, cleanup] = createEmitter();
      fireEvent.keyDown(createTileCanMove(), { key: 'Enter' });
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
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

      expect(tile.focus).toHaveBeenCalledWith();
    });

    test('space emits tile start event', () => {
      const [tileEvents, cleanup] = createEmitter();
      fireEvent.keyDown(createTileCanMove(), { key: ' ' });
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
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
      expect(createTileNoMove()).not.toHaveAttribute('draggable', 'false');
    });

    test('on drag emits start event', () => {
      const [tileEvents, cleanup] = createEmitter();
      fireEvent.dragStart(createTileCanMove());
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    test('on dragEnd emits end event', () => {
      const dropEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileDropped', (e) => dropEvents.push(e));
      fireEvent.dragEnd(createTileCanMove());
      const expectedEvent: HiveEvent = {
        type: 'tileDropped',
        tile: tileCanMove,
      };

      expect(dropEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    });

    test(`tile can be selected via action`, () => {
      const tile = createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      });
      expect(tile).toHaveClass('selected');
    });

    test(`an already selected tile doesnt fire a selected event when selected`, () => {
      const selectEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileSelected', (e) => selectEvents.push(e));
      createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      });
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      });
      expect(selectEvents).toHaveLength(1);
    });

    test(`an already deselected tile doesnt fire a deselected event when deselected`, () => {
      const deselectEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileDeselected', (e) => deselectEvents.push(e));
      createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      });
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      });
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      });
      expect(deselectEvents).toHaveLength(1);
    });

    test(`tile can be deselected via action`, () => {
      const tile = createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      });
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      });
      expect(tile).not.toHaveClass('selected');
    });

    test(`tile is only selected on matching select events`, () => {
      const tile = createTileCanMove();
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileNoMove });

      expect(tile).not.toHaveClass('selected');
    });

    test(`tile is only deselected on matching select events`, () => {
      const deselectEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileDeselected', (e) => deselectEvents.push(e));
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileNoMove });

      expect(deselectEvents).toHaveLength(0);
    });

    test('default on drop is prevented', () => {
      expect(simulateEvent(createTileCanMove(), 'drop')).toHaveBeenCalledWith();
      expect(simulateEvent(createTileNoMove(), 'drop')).toHaveBeenCalledWith();
    });
  });

  describe('tile Snapshot', () => {
    test('can move matches current snapshot', () => {
      expect(createTileCanMove()).toMatchSnapshot();
    });

    test('no moves matches current snapshot', () => {
      expect(createTileNoMove()).toMatchSnapshot();
    });
  });
});
