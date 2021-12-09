import { act, fireEvent, screen, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { HiveEvent, TileAction, TileEvent } from '../src/services';
import { getHiveDispatcher } from '../src/utilities/dispatcher';
import GameTile from '../src/components/GameTile';
import { simulateEvent } from './test-helpers';

const createDispatcher = (): [TileEvent[], () => void] => {
  const tileEvents: TileEvent[] = [];
  const listener = (event: TileEvent) => tileEvents.push(event);

  const dispatcher = getHiveDispatcher();
  const cleanup = dispatcher.add<TileEvent>('tileSelected', listener);
  return [tileEvents, cleanup];
};

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
      const mock = jest.spyOn(getHiveDispatcher(), 'dispatch');
      const tileCanMoveElement = createTileCanMove();

      userEvent.click(tileCanMoveElement);

      mock.mockClear();
      userEvent.click(tileCanMoveElement);

      expect(getHiveDispatcher().dispatch).not.toHaveBeenCalledWith(
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
      getHiveDispatcher().add<TileEvent>('tileDropped', (event) => dropEvents.push(event));
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
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      expect(tileCanMoveElement).toHaveClass('selected');
    });

    it(`an already selected tile doesn't fire a selected event when selected`, () => {
      const selectEvents: TileEvent[] = [];
      getHiveDispatcher().add<TileEvent>('tileSelected', (event) => selectEvents.push(event));
      createTileCanMove();
      act(() => {
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      act(() => {
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      expect(selectEvents).toHaveLength(1);
    });

    it(`an already deselected tile doesn't fire a deselected event when deselected`, () => {
      const deselectEvents: TileEvent[] = [];
      getHiveDispatcher().add<TileEvent>('tileDeselected', (event) => deselectEvents.push(event));
      createTileCanMove();
      act(() => {
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      }).catch(() => {});
      act(() => {
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      }).catch(() => {});
      act(() => {
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      }).catch(() => {});
      expect(deselectEvents).toHaveLength(1);
    });

    it(`tile can be deselected via action`, async () => {
      const tileCanMoveElement = createTileCanMove();

      await act(() => {
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      });
      await act(() => {
        getHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
      });
      expect(tileCanMoveElement).not.toHaveClass('selected');
    });

    it(`tile is only selected on matching select events`, () => {
      const tileNoMoveElement = createTileNoMove();
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileNoMove });

      expect(tileNoMoveElement).not.toHaveClass('selected');
    });

    it(`tile is only deselected on matching select events`, () => {
      createTileCanMove();
      createTileNoMove();
      const deselectEvents: TileEvent[] = [];
      getHiveDispatcher().add<TileEvent>('tileDeselected', (event) => deselectEvents.push(event));
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileNoMove });

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
    it('matches current snapshot for can move', () => {
      const tileCanMoveElement = createTileCanMove();

      expect(tileCanMoveElement).toMatchSnapshot();
    });

    it('matches current snapshot for no moves', () => {
      const tileNoMoveElement = createTileNoMove();
      expect(tileNoMoveElement).toMatchSnapshot();
    });

    it('matches current snapshot for when stacked', () => {
      render(<GameTile currentPlayer={0} {...tileNoMove} stacked={true} />);
      expect(screen.getByTitle(/Player-0/)).toMatchSnapshot();
    });
  });
});
