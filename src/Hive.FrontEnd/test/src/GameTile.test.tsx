import { fireEvent, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { HiveDispatcher, TileAction, TileEvent } from '../../src/services';
import GameTile from '../../src/components/GameTile';
import { simulateEvent } from '../helpers';
import { waitFor } from '@testing-library/dom';
import { Dispatcher } from '../../src/hooks/useHiveDispatchListener';
import { PlayerId, Tile } from '../../src/domain';
import { moveMap } from '../../src/services/signals';

const createTestDispatcher = (type: TileEvent['type'] = 'tileSelected'): [TileEvent[], HiveDispatcher] => {
  const dispatcher = new HiveDispatcher();
  const events = new Array<TileEvent>();
  const listener = (event: TileEvent) => events.push(event);
  dispatcher.add<TileEvent>(type, listener);

  return [events, dispatcher];
};

const tileCanMove = Object.freeze({
  id: 1,
  playerId: 1,
  creature: 'tileCanMove',
  moves: [{ q: 1, r: 1 }],
});

const tileNoMove = Object.freeze({ id: 2, playerId: 0, creature: 'tileNoMove', moves: [] });

const setup = (
  dispatcher: HiveDispatcher,
  ...tiles: (Tile & { stacked?: boolean; currentPlayer?: PlayerId })[]
) => {
  tiles.forEach((t) => moveMap.value.set(`${t.playerId}-${t.id}`, t.moves));

  return render(
    <Dispatcher.Provider value={dispatcher}>
      {tiles.map(({ currentPlayer, ...tile }) => (
        <GameTile key={tile.id} currentPlayer={currentPlayer === 0 ? 0 : 1} {...tile} />
      ))}
    </Dispatcher.Provider>
  );
};
describe('<GameTile>', () => {
  it('emits tile start event on click', async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileCanMove);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    await userEvent.click(tileCanMoveElement);

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it('emits tile start event on enter', async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
      fromEvent: false,
    };

    await userEvent.type(tileCanMoveElement, '{enter}');

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it('removes focus on mouse leave', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    expect(tileCanMoveElement).toHaveFocus();

    await userEvent.unhover(tileCanMoveElement);
    expect(tileCanMoveElement).not.toHaveFocus();
  });

  it('selects tile on enter', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{enter}');

    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
  });

  it('deselects tile on second enter', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.hover(tileCanMoveElement);
    await userEvent.keyboard('{enter}');
    expect(screen.getByTitle(/tilecanmove/i)).toHaveClass('selected');

    await userEvent.keyboard('{enter}');
    expect(screen.getByTitle(/tilecanmove/i)).not.toHaveClass('selected');
  });

  it('use handler', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{arrowdown}');

    expect(tileCanMoveElement).toHaveFocus();
  });

  it('emits tile start event on space', async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();

    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.type(tileCanMoveElement, ' ');
    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it('selects previous selected tile on click', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/tileCanMove/)).not.toHaveClass('selected');
  });

  it('deselects previous selected tile on click', async () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
  });

  it(`doesn't fire a tile start event with multiple clicks on the same tile`, async () => {
    const [tileEvents, dispatcher] = createTestDispatcher();

    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    await userEvent.click(tileCanMoveElement);

    expect(tileEvents).toHaveLength(1);
    expect(tileEvents).toStrictEqual([expect.objectContaining({ type: 'tileSelected' })]);
  });

  it('is draggable when there are available moves', () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    expect(tileCanMoveElement).toHaveAttribute('draggable', 'true');
  });

  it('is *not* draggable when there are no moves available', () => {
    setup(new HiveDispatcher(), tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(tileNoMoveElement).toHaveAttribute('draggable', 'false');
  });

  it('emits start event on drag start', () => {
    const [tileEvents, dispatcher] = createTestDispatcher();

    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    fireEvent.dragStart(tileCanMoveElement);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it('emits tile dropped event on drag end', () => {
    const [dropEvents, dispatcher] = createTestDispatcher('tileDropped');
    setup(dispatcher, tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    fireEvent.dragEnd(tileCanMoveElement);

    expect(dropEvents).toEqual([
      {
        type: 'tileDropped',
        tile: tileCanMove,
      },
    ]);
  });

  it(`tile can be selected via action`, async () => {
    const [, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileCanMove);

    screen.getByTitle(/tileCanMove/);
    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });

    await waitFor(() => expect(screen.getByTitle(/tileCanMove/)).toHaveClass('selected'));
  });

  it(`doesn't emit a *selected* event when the tile is already selected`, async () => {
    const [selectedEvents, dispatcher] = createTestDispatcher('tileSelected');
    setup(dispatcher, tileCanMove);

    await userEvent.click(screen.getByTitle(/tileCanMove/));
    expect(screen.getByTitle(/tileCanMove/)).toHaveClass('selected');

    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });

    expect(selectedEvents).toHaveLength(1);
  });

  it(`doesn't emit a *selected* event when opponents tile is selected from dispatch`, async () => {
    const [selectedEvents, dispatcher] = createTestDispatcher('tileSelected');

    setup(dispatcher, { ...tileCanMove, currentPlayer: 0 });

    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });

    expect(selectedEvents).toHaveLength(0);
  });

  it(`tile is only *selected* on matching select events`, () => {
    const [, dispatcher] = createTestDispatcher();
    setup(dispatcher, tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    dispatcher.dispatch<TileAction>({
      type: 'tileSelect',
      tile: { id: 1, playerId: 0, creature: 'queen' },
    });

    expect(tileNoMoveElement).not.toHaveClass('selected');
  });

  it(`tile is only deselected on matching select events`, () => {
    const [deselectEvents, dispatcher] = createTestDispatcher('tileDeselected');
    setup(dispatcher, tileCanMove, tileNoMove);

    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    dispatcher.dispatch<TileAction>({ type: 'tileDeselect', tile: tileNoMove });

    expect(deselectEvents).toHaveLength(0);
  });

  it('default on drop is prevented', () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    setup(new HiveDispatcher(), tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);

    expect(simulateEvent(tileCanMoveElement, 'drop')).toHaveBeenCalledWith();
    expect(simulateEvent(tileNoMoveElement, 'drop')).toHaveBeenCalledWith();
  });
});

describe('tile Snapshot', () => {
  it('matches current snapshot for can move', () => {
    setup(new HiveDispatcher(), tileCanMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    expect(tileCanMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for no moves', () => {
    setup(new HiveDispatcher(), tileNoMove);

    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(tileNoMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for when stacked', () => {
    setup(new HiveDispatcher(), { ...tileNoMove, stacked: true });

    expect(screen.getByTitle(/Player-0/)).toMatchSnapshot();
  });

  it('renders creature', () => {
    setup(new HiveDispatcher(), tileCanMove, tileNoMove);

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);

    expect(tileCanMoveElement).toMatchSnapshot();
    expect(tileNoMoveElement).toMatchSnapshot();
  });
});
