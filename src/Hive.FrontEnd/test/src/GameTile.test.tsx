import { act, fireEvent, screen, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { HiveEvent, TileAction, TileEvent } from '../../src/services';
import { getHiveDispatcher } from '../../src/utilities/dispatcher';
import GameTile from '../../src/components/GameTile';
import { simulateEvent } from '../helpers';

const createDispatcher = (): [TileEvent[], () => void] => {
  const tileEvents: Array<TileEvent> = [];
  const listener = (event: TileEvent) => tileEvents.push(event);

  const dispatcher = getHiveDispatcher();
  const cleanup = dispatcher.add<TileEvent>('tileSelected', listener);
  return [tileEvents, cleanup];
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
      <>
        <GameTile currentPlayer={1} {...tileCanMove} />
        <GameTile currentPlayer={1} {...tileNoMove} />
      </>
    );
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);

    expect(tileCanMoveElement).toMatchSnapshot();
    expect(tileNoMoveElement).toMatchSnapshot();
  });
});

describe('tile events', () => {
  it('emits tile start event on click', async () => {
    const [tileEvents, cleanup] = createDispatcher();
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
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
    const [tileEvents, cleanup] = createDispatcher();
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    await userEvent.type(tileCanMoveElement, '{enter}');
    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
      fromEvent: false,
    };
    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    cleanup();
  });

  it('selects tile on enter', async () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    tileCanMoveElement.focus();
    await userEvent.keyboard('{enter}');

    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
  });

  it('deselects tile on second enter', async () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{enter}');
    await userEvent.keyboard('{enter}');
    expect(await screen.findByTitle(/tilecanmove/i)).not.toHaveClass('selected');
  });

  it('use handler', async () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.keyboard('{arrowdown}');

    expect(tileCanMoveElement).toHaveFocus();
  });

  it('emits tile start event on space', async () => {
    const [tileEvents, cleanup] = createDispatcher();
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
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
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
    await userEvent.click(tileCanMoveElement);

    expect(await screen.findByTitle(/tileCanMove/)).not.toHaveClass('selected');
  });

  it('deselects previous selected tile on click', async () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);

    expect(await screen.findByTitle(/tileCanMove/)).toHaveClass('selected');
  });

  it('doesnt fire a tile start event with multiple clicks on the same tile', async () => {
    const [tileEvents, cleanup] = createDispatcher();
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    await userEvent.click(tileCanMoveElement);
    await userEvent.click(tileCanMoveElement);

    expect(tileEvents).toHaveLength(1);
    expect(tileEvents).toStrictEqual([expect.objectContaining({ type: 'tileSelected' })]);
    cleanup();
  });

  it('removes focus on mouseLeave', async () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    tileCanMoveElement.focus();
    await userEvent.unhover(tileCanMoveElement);
    expect(tileCanMoveElement).not.toHaveFocus();
  });

  it('is draggable when there are available moves', () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    expect(tileCanMoveElement).toHaveAttribute('draggable', 'true');
  });

  it('is *not* draggable when there are no moves available', () => {
    render(<GameTile currentPlayer={1} {...tileNoMove} />);
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(tileNoMoveElement).not.toHaveAttribute('draggable', 'false');
  });

  it('emits start event on drag start', () => {
    const [tileEvents, cleanup] = createDispatcher();

    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    fireEvent.dragStart(tileCanMoveElement);
    fireEvent.dragStart(tileCanMoveElement);
    const expectedEvent: TileEvent = {
      type: 'tileSelected',
      tile: tileCanMove,
    };
    expect(tileEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
    cleanup();
  });

  it('emits tile dropped event on drag end', () => {
    const dropEvents: Array<TileEvent> = [];
    getHiveDispatcher().add<TileEvent>('tileDropped', (event) => dropEvents.push(event));
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    fireEvent.dragEnd(tileCanMoveElement);
    const expectedEvent: HiveEvent = {
      type: 'tileDropped',
      tile: tileCanMove,
    };

    expect(dropEvents).toEqual(expect.arrayContaining([expect.objectContaining(expectedEvent)]));
  });

  it(`tile can be selected via action`, () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    act(() => {
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    }).catch(() => {});
    expect(tileCanMoveElement).toHaveClass('selected');
  });

  it(`an already selected tile doesn't fire a selected event when selected`, () => {
    const selectEvents: Array<TileEvent> = [];
    getHiveDispatcher().add<TileEvent>('tileSelected', (event) => selectEvents.push(event));

    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    act(() => {
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    }).catch(() => {});
    act(() => {
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    }).catch(() => {});
    expect(selectEvents).toHaveLength(1);
  });

  it(`an already deselected tile doesn't fire a deselected event when deselected`, () => {
    const deselectEvents: Array<TileEvent> = [];
    getHiveDispatcher().add<TileEvent>('tileDeselected', (event) => deselectEvents.push(event));

    render(<GameTile currentPlayer={1} {...tileCanMove} />);
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
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    await act(() => {
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    });
    await act(() => {
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileCanMove });
    });
    expect(tileCanMoveElement).not.toHaveClass('selected');
  });

  it(`tile is only selected on matching select events`, () => {
    render(<GameTile currentPlayer={1} {...tileNoMove} />);
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileNoMove });

    expect(tileNoMoveElement).not.toHaveClass('selected');
  });

  it(`tile is only deselected on matching select events`, () => {
    render(
      <>
        <GameTile currentPlayer={1} {...tileCanMove} />
        <GameTile currentPlayer={1} {...tileNoMove} />
      </>
    );
    const deselectEvents: Array<TileEvent> = [];
    getHiveDispatcher().add<TileEvent>('tileDeselected', (event) => deselectEvents.push(event));
    getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: tileCanMove });
    getHiveDispatcher().dispatch<TileAction>({ type: 'tileDeselect', tile: tileNoMove });

    expect(deselectEvents).toHaveLength(0);
  });

  it('default on drop is prevented', () => {
    render(
      <>
        {' '}
        <GameTile currentPlayer={1} {...tileCanMove} />
        <GameTile currentPlayer={1} {...tileNoMove} />{' '}
      </>
    );

    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(simulateEvent(tileCanMoveElement, 'drop')).toHaveBeenCalledWith();
    expect(simulateEvent(tileNoMoveElement, 'drop')).toHaveBeenCalledWith();
  });
});

describe('tile Snapshot', () => {
  it('matches current snapshot for can move', () => {
    render(<GameTile currentPlayer={1} {...tileCanMove} />);
    const tileCanMoveElement = screen.getByTitle(/tileCanMove/);

    expect(tileCanMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for no moves', () => {
    render(<GameTile currentPlayer={1} {...tileNoMove} />);
    const tileNoMoveElement = screen.getByTitle(/tileNoMove/);
    expect(tileNoMoveElement).toMatchSnapshot();
    expect(tileNoMoveElement).toMatchSnapshot();
  });

  it('matches current snapshot for when stacked', () => {
    render(<GameTile currentPlayer={0} {...tileNoMove} stacked={true} />);
    expect(screen.getByTitle(/Player-0/)).toMatchSnapshot();
  });
});
