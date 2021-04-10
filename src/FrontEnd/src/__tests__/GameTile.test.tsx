import { act, fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { HiveEvent, TileAction, TileEvent } from '../services';
import { useHiveDispatcher } from '../utilities/dispatcher';
import GameTile from '../components/GameTile';
import { renderElement, simulateEvent } from './test-helpers';

describe('tile Tests', () => {
  const tileCanMove = {
    id: 1,
    playerId: 1,
    creature: 'ant',
    moves: [{ q: 1, r: 1 }],
  };
  const tileNoMove = { id: 2, playerId: 0, creature: 'fly', moves: [] };

  const createTileCanMove = () => {
    return renderElement(<GameTile currentPlayer={1} {...tileCanMove} />);
  };

  const createTileNoMove = () => {
    return renderElement(<GameTile currentPlayer={1} {...tileNoMove} />);
  };

  const createDispatcher = (): [TileEvent[], () => void] => {
    const tileEvents: TileEvent[] = [];
    const listener = (e: TileEvent) => tileEvents.push(e);

    const dispatcher = useHiveDispatcher();
    const cleanup = dispatcher.add<TileEvent>('tileSelected', listener);
    return [tileEvents, cleanup];
  };

  describe('tile render', () => {
    it('has creature', () => {
      expect(createTileNoMove().querySelectorAll('.creature')).toHaveLength(1);
      expect(createTileCanMove().querySelectorAll('.creature')).toHaveLength(1);
    });
  });

  describe('tile events', () => {
    it('click emits tile start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      fireEvent.click(createTileCanMove());
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('enter emits tile start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      fireEvent.keyDown(createTileCanMove(), { key: 'Enter' });
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
        fromEvent: false,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('enter selects tile', () => {
      const tile = createTileCanMove();
      fireEvent.keyDown(tile, { key: 'Enter' });

      expect(tile).toHaveClass('selected');
    });

    it('second enter deselects tile', () => {
      const tile = createTileCanMove();
      fireEvent.keyDown(tile, { key: 'Enter' });
      fireEvent.keyDown(tile, { key: 'Enter' });

      expect(tile).not.toHaveClass('selected');
    });

    it('arrow keys use handler', () => {
      const tile = createTileCanMove();
      fireEvent.keyDown(tile, { key: 'ArrowDown' });

      expect(tile).toHaveFocus();
    });

    it('space emits tile start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      fireEvent.keyDown(createTileCanMove(), { key: ' ' });
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('click deselects previous selected tile', () => {
      const tile = createTileCanMove();
      fireEvent.click(tile);

      expect(tile).toHaveClass('selected');
    });

    it('clicking same tile doesnt fire a tile start event', () => {
      const mock = jest.spyOn(useHiveDispatcher(), 'dispatch');
      const tile = createTileCanMove();
      fireEvent.click(tile);

      mock.mockClear();
      fireEvent.click(tile);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'tileSelect' })
      );
    });

    it('mouseLeave activates blur', () => {
      const tile = createTileCanMove();
      tile.focus();
      fireEvent.mouseLeave(tile);
      expect(tile).not.toHaveFocus();
    });

    it('is draggable when there are available moves', () => {
      expect(createTileCanMove()).toHaveAttribute('draggable', 'true');
    });

    it('is *not* draggable when there are no moves available', () => {
      expect(createTileNoMove()).not.toHaveAttribute('draggable', 'false');
    });

    it('on drag emits start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      fireEvent.dragStart(createTileCanMove());
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('on dragEnd emits end event', () => {
      const dropEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileDropped', (e) => dropEvents.push(e));
      fireEvent.dragEnd(createTileCanMove());
      const expectedEvent: HiveEvent = {
        type: 'tileDropped',
        tile: tileCanMove,
      };

      expect(dropEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    });

    it(`tile can be selected via action`, () => {
      const tile = createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      expect(tile).toHaveClass('selected');
    });

    it(`an already selected tile doesnt fire a selected event when selected`, () => {
      const selectEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileSelected', (e) => selectEvents.push(e));
      createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      expect(selectEvents).toHaveLength(1);
    });

    it(`an already deselected tile doesnt fire a deselected event when deselected`, () => {
      const deselectEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileDeselected', (e) => deselectEvents.push(e));
      createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      }).catch(() => {});
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      }).catch(() => {});
      expect(deselectEvents).toHaveLength(1);
    });

    it(`tile can be deselected via action`, () => {
      const tile = createTileCanMove();
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      }).catch(() => {});
      expect(tile).not.toHaveClass('selected');
    });

    it(`tile is only selected on matching select events`, () => {
      const tile = createTileCanMove();
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileNoMove });

      expect(tile).not.toHaveClass('selected');
    });

    it(`tile is only deselected on matching select events`, () => {
      const deselectEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileDeselected', (e) => deselectEvents.push(e));
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileNoMove });

      expect(deselectEvents).toHaveLength(0);
    });

    it('default on drop is prevented', () => {
      expect(simulateEvent(createTileCanMove(), 'drop')).toHaveBeenCalledWith();
      expect(simulateEvent(createTileNoMove(), 'drop')).toHaveBeenCalledWith();
    });
  });

  describe('tile Snapshot', () => {
    it('can move matches current snapshot', () => {
      expect(createTileCanMove()).toMatchSnapshot();
    });

    it('no moves matches current snapshot', () => {
      expect(createTileNoMove()).toMatchSnapshot();
    });

    it('when stacked matched snapshot', () => {
      expect(renderElement(<GameTile currentPlayer={0} {...tileNoMove} stacked={true} />)).toMatchSnapshot();
    });
  });
});
