import { act, fireEvent, screen, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { h } from 'preact';
import { HiveEvent, TileAction, TileEvent } from '../src/services';
import { useHiveDispatcher } from '../src/utilities/dispatcher';
import GameTile from '../src/components/GameTile';
import { simulateEvent } from './test-helpers';

describe('tile Tests', () => {
  const tileCanMove = {
    id: 1,
    playerId: 1,
    creature: 'tileCanMove',
    moves: [{ q: 1, r: 1 }],
  };
  const tileNoMove = { id: 2, playerId: 0, creature: 'tileNoMove', moves: [] };

  const createTileCanMove = () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    return screen.getByTitle(/tileCanMove/);
  };

  const createTileNoMove = () => {
    render(<GameTile currentPlayer={1} {...tileNoMove} />);
    return screen.getByTitle(/tileNoMove/);
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
      const tileCanMoveElement = createTileCanMove();
      const tileNoMoveElement = createTileNoMove();
      expect(tileCanMoveElement).toMatchSnapshot();
      expect(tileNoMoveElement).toMatchSnapshot();
    });
  });

  describe('tile events', () => {
    it('click emits tile start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      const tileCanMoveElement = createTileCanMove();
      userEvent.click(tileCanMoveElement);
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('enter emits tile start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      const tileCanMoveElement = createTileCanMove();
      userEvent.type(tileCanMoveElement, '{enter}');
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
        fromEvent: false,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('enter selects tile', async () => {
      const tileCanMoveElement = createTileCanMove();
      tileCanMoveElement.focus();
      userEvent.keyboard('{enter}');

      expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
    });

    it('second enter deselects tile', async () => {
      const tileCanMoveElement = createTileCanMove();

      tileCanMoveElement.focus();
      userEvent.keyboard('{enter}');
      expect(await screen.findByTitle(/tilecanmove/i)).toHaveClass('selected');
      userEvent.keyboard('{enter}');

      expect(await screen.findByTitle(/tilecanmove/i)).not.toHaveClass('selected');
    });

    it('arrow keys use handler', () => {
      const tileCanMoveElement = createTileCanMove();

      tileCanMoveElement.focus();
      userEvent.keyboard('{arrowdown}');

      expect(tileCanMoveElement).toHaveFocus();
    });

    it('space emits tile start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      const tileCanMoveElement = createTileCanMove();

      tileCanMoveElement.focus();
      userEvent.type(tileCanMoveElement, ' ');
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('click selects previous selected tile', async () => {
      const tileCanMoveElement = createTileCanMove();

      userEvent.click(tileCanMoveElement);
      expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
      userEvent.click(tileCanMoveElement);

      expect(await screen.findByTitle(/tileCanMove/)).not.toHaveClass('selected');
    });
    it('click deselects previous selected tile', async () => {
      const tileCanMoveElement = createTileCanMove();

      userEvent.click(tileCanMoveElement);

      expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
    });

    it('clicking same tile doesnt fire a tile start event', () => {
      const mock = jest.spyOn(useHiveDispatcher(), 'dispatch');
      const tileCanMoveElement = createTileCanMove();

      userEvent.click(tileCanMoveElement);

      mock.mockClear();
      userEvent.click(tileCanMoveElement);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'tileSelect' })
      );
    });

    it('mouseLeave activates blur', () => {
      const tileCanMoveElement = createTileCanMove();
      tileCanMoveElement.focus();
      userEvent.unhover(tileCanMoveElement);
      expect(tileCanMoveElement).not.toHaveFocus();
    });

    it('is draggable when there are available moves', () => {
      const tileCanMoveElement = createTileCanMove();
      expect(tileCanMoveElement).toHaveAttribute('draggable', 'true');
    });

    it('is *not* draggable when there are no moves available', () => {
      const tileNoMoveElement = createTileNoMove();
      expect(tileNoMoveElement).not.toHaveAttribute('draggable', 'false');
    });

    it('on drag emits start event', () => {
      const [tileEvents, cleanup] = createDispatcher();
      const tileCanMoveElement = createTileCanMove();
      fireEvent.dragStart(tileCanMoveElement);
      const expectedEvent: TileEvent = {
        type: 'tileSelected',
        tile: tileCanMove,
      };
      expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
      cleanup();
    });

    it('on dragEnd emits end event', () => {
      const dropEvents: TileEvent[] = [];
      const tileCanMoveElement = createTileCanMove();
      useHiveDispatcher().add<TileEvent>('tileDropped', (e) => dropEvents.push(e));
      fireEvent.dragEnd(tileCanMoveElement);
      const expectedEvent: HiveEvent = {
        type: 'tileDropped',
        tile: tileCanMove,
      };

      expect(dropEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    });

    it(`tile can be selected via action`, () => {
      const tileCanMoveElement = createTileCanMove();

      act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      expect(tileCanMoveElement).toHaveClass('selected');
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

    it(`tile can be deselected via action`, async () => {
      const tileCanMoveElement = createTileCanMove();

      await act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      });
      await act(() => {
        useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      });
      expect(tileCanMoveElement).not.toHaveClass('selected');
    });

    it(`tile is only selected on matching select events`, () => {
      const tileNoMoveElement = createTileNoMove();
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileNoMove });

      expect(tileNoMoveElement).not.toHaveClass('selected');
    });

    it(`tile is only deselected on matching select events`, () => {
      createTileCanMove();
      createTileNoMove();
      const deselectEvents: TileEvent[] = [];
      useHiveDispatcher().add<TileEvent>('tileDeselected', (e) => deselectEvents.push(e));
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      useHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileNoMove });

      expect(deselectEvents).toHaveLength(0);
    });

    it('default on drop is prevented', () => {
      const tileCanMoveElement = createTileCanMove();
      const tileNoMoveElement = createTileNoMove();
      expect(simulateEvent(tileCanMoveElement, 'drop')).toHaveBeenCalledWith();
      expect(simulateEvent(tileNoMoveElement, 'drop')).toHaveBeenCalledWith();
    });
  });

  describe('tile Snapshot', () => {
    it('can move matches current snapshot', () => {
      const tileCanMoveElement = createTileCanMove();

      expect(tileCanMoveElement).toMatchSnapshot();
    });

    it('no moves matches current snapshot', () => {
      const tileNoMoveElement = createTileNoMove();
      expect(tileNoMoveElement).toMatchSnapshot();
    });

    it('when stacked matched snapshot', () => {
      render(<GameTile currentPlayer={0} {...tileNoMove} stacked={true} />);
      expect(screen.getByTitle(/Player-0/)).toMatchSnapshot();
    });
  });
});
