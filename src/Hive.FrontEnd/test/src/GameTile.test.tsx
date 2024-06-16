import { fireEvent, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { HiveDispatcher, TileEvent } from '@hive/services';
import GameTile from '../../src/components/GameTile';
import { simulateEvent } from '../helpers';
import { waitFor } from '@testing-library/dom';
import { Dispatcher } from '@hive/hooks/useHiveDispatchListener';
import { Tile } from '@hive/domain';
import { moveMap } from '@hive/services/game-state-context.ts';

const createTestDispatcher = (type: TileEvent['type'] = 'tileSelected') => {
  const dispatcher = new HiveDispatcher();
  const events = new Array<TileEvent>();
  const listener = (event: TileEvent) => {
    events.push(event);
  };
  dispatcher.add(type, listener);

  return [events, dispatcher] as const;
};

const tileCanMove = Object.freeze({
  id: 1,
  playerId: 1,
  creature: 'grasshopper',
  moves: [{ q: 1, r: 1 }],
});

const tileOpponentCanMove = Object.freeze({
  id: 2,
  playerId: 0,
  creature: 'spider',
  moves: [{ q: 1, r: 1 }],
});

const tileNoMove = Object.freeze({ id: 2, playerId: 0, creature: 'queen', moves: [] });

const setup = (dispatcher: HiveDispatcher, ...tiles: (Tile & { stacked?: boolean })[]) => {
  for (const t of tiles) moveMap.value.set(`${t.playerId}-${t.id}`, t.moves);

  return render(
    <Dispatcher.Provider value={dispatcher}>
      {tiles.map(({ ...tile }) => (
        <GameTile key={tile.id} currentPlayer={1} {...tile} />
      ))}
    </Dispatcher.Provider>
  );
};
describe('<GameTile> event dispatcher', () => {
  it('dispatches tile start event on click', async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileCanMove);
    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    await userEvent.click(tileCanMoveElement);

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it('dispatches tile start event on enter', async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
      fromEvent: false,
    };

    await userEvent.type(tileCanMoveElement, '{enter}');

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it('dispatches tile start event on space', async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();

    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    tileCanMoveElement.focus();
    await userEvent.type(tileCanMoveElement, ' ');
    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it(`is selected via dispatched action`, async () => {
    const [, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileCanMove);

    screen.getByTitle(/grasshopper/);
    dispatcher.dispatch({ type: 'tileSelect', tile: tileCanMove });

    await waitFor(() => expect(screen.getByTitle(/grasshopper/)).toHaveClass('selected'));
  });

  it(`doesn't dispatch selected event with multiple clicks on the same tile`, async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();

    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    await userEvent.click(tileCanMoveElement);
    await userEvent.click(tileCanMoveElement);

    expect(tileEvents).toHaveLength(1);
    expect(tileEvents).toStrictEqual([expect.objectContaining({ type: 'tileSelected' })]);
  });

  it('dispatches start event on drag start', () => {
    const [tileEvents, dispatcher] = createTestDispatcher();

    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    fireEvent.dragStart(tileCanMoveElement);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it('dispatches drop event on drag end', () => {
    const [dropEvents, dispatcher] = createTestDispatcher('tileDropped');
    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);
    fireEvent.dragEnd(tileCanMoveElement);

    expect(dropEvents).toEqual([
      {
        type: 'tileDropped',
        tile: tileCanMove,
      },
    ]);
  });

  it(`doesn't emit a *selected* event when the tile is already selected`, async () => {
    const [selectedEvents, dispatcher] = createTestDispatcher('tileSelected');
    setup(dispatcher, tileCanMove);

    await userEvent.click(screen.getByTitle(/grasshopper/));
    expect(screen.getByTitle(/grasshopper/)).toHaveClass('selected');

    dispatcher.dispatch({ type: 'tileSelect', tile: tileCanMove });

    expect(selectedEvents).toHaveLength(1);
  });

  it(`doesn't emit a *selected* event when opponents tile is selected from dispatch`, async () => {
    const [selectedEvents, dispatcher] = createTestDispatcher('tileSelected');

    setup(dispatcher, { ...tileOpponentCanMove });

    dispatcher.dispatch({ type: 'tileSelect', tile: tileCanMove });

    expect(selectedEvents).toHaveLength(0);
  });

  it(`is only *selected* on selected events matching id`, () => {
    const [, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/queen/);
    dispatcher.dispatch({
      type: 'tileSelect',
      tile: { id: 1, playerId: 0, creature: 'queen' },
    });

    expect(tileNoMoveElement).not.toHaveClass('selected');
  });

  it(`is only *deselected* on deselected events matching id`, () => {
    const [deselectEvents, dispatcher] = createTestDispatcher('tileDeselected');
    setup(dispatcher, tileCanMove, tileNoMove);

    dispatcher.dispatch({ type: 'tileSelect', tile: tileCanMove });
    dispatcher.dispatch({ type: 'tileDeselect', tile: tileNoMove });

    expect(deselectEvents).toHaveLength(0);
  });
});
describe('<GameTile> events', () => {
  it('removes focus on mouse leave', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    await userEvent.click(tileCanMoveElement);
    expect(tileCanMoveElement).toHaveFocus();

    await userEvent.unhover(tileCanMoveElement);
    expect(tileCanMoveElement).not.toHaveFocus();
  });
  it('focuses on arrow down', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{arrowdown}');

    expect(tileCanMoveElement).toHaveFocus();
  });

  it('selects tile on enter', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{enter}');

    expect(await screen.findByTitle(/grasshopper/)).toHaveClass('selected');
  });

  it('deselects tile on second enter', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    await userEvent.hover(tileCanMoveElement);
    await userEvent.keyboard('{enter}');
    expect(screen.getByTitle(/grasshopper/i)).toHaveClass('selected');

    await userEvent.keyboard('{enter}');
    expect(screen.getByTitle(/grasshopper/i)).not.toHaveClass('selected');
  });

  it('selects previous selected tile on click', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/grasshopper/)).toHaveClass('selected');

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/grasshopper/)).not.toHaveClass('selected');
  });

  it('deselects previous selected tile on click', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/grasshopper/)).toHaveClass('selected');
  });

  it('is draggable when there are available moves', () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    expect(tileCanMoveElement).toHaveAttribute('draggable', 'true');
  });

  it('is *not* draggable when there are no moves available', () => {
    setup(new HiveDispatcher(), tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/queen/);
    expect(tileNoMoveElement).toHaveAttribute('draggable', 'false');
  });

  it(`deselects current players tile on click`, async () => {
    const [deselectEvents, dispatcher] = createTestDispatcher('tileDeselected');
    setup(dispatcher, tileCanMove, tileOpponentCanMove);

    dispatcher.dispatch({ type: 'tileSelect', tile: tileOpponentCanMove });
    await userEvent.click(screen.getByTitle(/spider/));

    expect(deselectEvents).toHaveLength(0);
  });

  it('prevents default on drop', () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    setup(new HiveDispatcher(), tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/queen/);

    expect(simulateEvent(tileCanMoveElement, 'drop')).toHaveBeenCalledWith();
    expect(simulateEvent(tileNoMoveElement, 'drop')).toHaveBeenCalledWith();
  });
});

describe('<GameTile> Snapshots', () => {
  it('matches current snapshot for can move', () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);

    expect(tileCanMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for no moves', () => {
    setup(new HiveDispatcher(), tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/queen/);
    expect(tileNoMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for when stacked', () => {
    setup(new HiveDispatcher(), { ...tileNoMove, stacked: true });

    expect(screen.getByTitle(/Player-0/)).toMatchSnapshot();
  });

  it('renders creature', () => {
    setup(new HiveDispatcher(), tileCanMove, tileNoMove);

    const tileCanMoveElement = screen.getByTitle(/grasshopper/);
    const tileNoMoveElement = screen.getByTitle(/queen/);

    expect(tileCanMoveElement).toMatchSnapshot();
    expect(tileNoMoveElement).toMatchSnapshot();
  });
});
