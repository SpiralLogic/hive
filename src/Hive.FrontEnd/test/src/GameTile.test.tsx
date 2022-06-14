import { act, fireEvent, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { HiveDispatcher, HiveEvent, TileAction, TileEvent } from '../../src/services';
import GameTile from '../../src/components/GameTile';
import { simulateEvent } from '../helpers';
import { Dispatcher } from '../../src/utilities/dispatcher';

const createTestDispatcher = (
  type: TileEvent['type'] = 'tileSelected'
): [TileEvent[], () => void, HiveDispatcher] => {
  const dispatcher = new HiveDispatcher();
  const events = new Array<TileEvent>();
  const listener = (event: TileEvent) => events.push(event);
  const cleanup = dispatcher.add<TileEvent>(type, listener);

  return [events, cleanup, dispatcher];
};

const tileCanMove = Object.freeze({
  id: 1,
  playerId: 1,
  creature: 'tileCanMove',
  moves: [{ q: 1, r: 1 }],
});

const tileNoMove = Object.freeze({ id: 2, playerId: 0, creature: 'tileNoMove', moves: [] });

describe('<GameTile>', () => {
  it('renders creature', () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
        <GameTile currentPlayer={1} {...tileNoMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);

    expect(tileCanMoveElement).toMatchSnapshot();
    expect(tileNoMoveElement).toMatchSnapshot();
  });

  it('emits tile start event on click', async () => {
    const [tileEvents, cleanup, dispatcher] = createTestDispatcher();
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    await userEvent.click(tileCanMoveElement);

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    cleanup();
  });

  it('emits tile start event on enter', async () => {
    const [tileEvents, cleanup, dispatcher] = createTestDispatcher();

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
      fromEvent: false,
    };

    await userEvent.type(tileCanMoveElement, '{enter}');

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    cleanup();
  });

  it('selects tile on enter', async () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{enter}');

    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
  });

  it('deselects tile on second enter', async () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{enter}');
    expect(await screen.findByTitle(/tilecanmove/i)).toHaveClass('selected');

    await userEvent.keyboard('{enter}');
    expect(await screen.findByTitle(/tilecanmove/i)).not.toHaveClass('selected');
  });

  it('use handler', async () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{arrowdown}');

    expect(tileCanMoveElement).toHaveFocus();
  });

  it('emits tile start event on space', async () => {
    const [tileEvents, cleanup, dispatcher] = createTestDispatcher();

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.type(tileCanMoveElement, ' ');
    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };

    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    cleanup();
  });

  it('selects previous selected tile on click', async () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/tileCanMove/)).not.toHaveClass('selected');
  });

  it('deselects previous selected tile on click', async () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
  });

  it('doesnt fire a tile start event with multiple clicks on the same tile', async () => {
    const [tileEvents, cleanup, dispatcher] = createTestDispatcher();

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    await userEvent.click(tileCanMoveElement);

    expect(tileEvents).toHaveLength(1);
    expect(tileEvents).toStrictEqual([expect.objectContaining({ type: 'tileSelected' })]);
    cleanup();
  });

  it('removes focus on mouseLeave', async () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.unhover(tileCanMoveElement);
    expect(tileCanMoveElement).not.toHaveFocus();
  });

  it('is draggable when there are available moves', () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    expect(tileCanMoveElement).toHaveAttribute('draggable', 'true');
  });

  it('is *not* draggable when there are no moves available', () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileNoMove} />
      </Dispatcher.Provider>
    );
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(tileNoMoveElement).not.toHaveAttribute('draggable', 'false');
  });

  it('emits start event on drag start', () => {
    const [tileEvents, cleanup, dispatcher] = createTestDispatcher();

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    fireEvent.dragStart(tileCanMoveElement);
    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };
    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    cleanup();
  });

  it('emits tile dropped event on drag end', () => {
    const [dropEvents, , dispatcher] = createTestDispatcher('tileDropped');
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    fireEvent.dragEnd(tileCanMoveElement);

    const expectedEvent: HiveEvent = {
      type: 'tileDropped',
      tile: tileCanMove,
    };

    expect(dropEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it(`tile can be selected via action`, () => {
    const dispatcher = createTestDispatcher()[2];

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    }).catch(() => {});

    expect(tileCanMoveElement).toHaveClass('selected');
  });

  it(`an already selected tile doesn't fire a selected event when selected`, () => {
    const [selectEvents, , dispatcher] = createTestDispatcher('tileSelected');

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    }).catch(() => {});
    act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    }).catch(() => {});
    expect(selectEvents).toHaveLength(1);
  });

  it(`an already deselected tile doesn't fire a deselected event when deselected`, () => {
    const [deselectEvents, , dispatcher] = createTestDispatcher('tileDeselected');

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    }).catch(() => {});
    act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
    }).catch(() => {});
    act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
    }).catch(() => {});
    expect(deselectEvents).toHaveLength(1);
  });

  it(`tile can be deselected via action`, async () => {
    const dispatcher = createTestDispatcher()[2];
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    });
    await act(() => {
      dispatcher.dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
    });
    expect(tileCanMoveElement).not.toHaveClass('selected');
  });

  it(`tile is only selected on matching select events`, () => {
    const dispatcher = createTestDispatcher()[2];
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileNoMove} />
      </Dispatcher.Provider>
    );
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileNoMove });

    expect(tileNoMoveElement).not.toHaveClass('selected');
  });

  it(`tile is only deselected on matching select events`, () => {
    const [deselectEvents, , dispatcher] = createTestDispatcher('tileDeselected');
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameTile currentPlayer={1} {...tileCanMove} />
        <GameTile currentPlayer={1} {...tileNoMove} />
      </Dispatcher.Provider>
    );

    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    dispatcher.dispatch<TileAction>({ type: 'tileDeselect', tile: tileNoMove });

    expect(deselectEvents).toHaveLength(0);
  });

  it('default on drop is prevented', () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileNoMove} />
      </Dispatcher.Provider>
    );
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(simulateEvent(tileCanMoveElement, 'drop')).toHaveBeenCalledWith();
    expect(simulateEvent(tileNoMoveElement, 'drop')).toHaveBeenCalledWith();
  });
});

describe('tile Snapshot', () => {
  it('matches current snapshot for can move', () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileCanMove} />
      </Dispatcher.Provider>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    expect(tileCanMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for no moves', () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={1} {...tileNoMove} />
      </Dispatcher.Provider>
    );
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(tileNoMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for when stacked', () => {
    render(
      <Dispatcher.Provider value={new HiveDispatcher()}>
        <GameTile currentPlayer={0} {...tileNoMove} stacked={true} />
      </Dispatcher.Provider>
    );
    expect(screen.getByTitle(/Player-0/)).toMatchSnapshot();
  });
});
