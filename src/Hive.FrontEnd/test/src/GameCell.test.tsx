import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import GameCell from '../../src/components/GameCell';
import { simulateEvent } from '../helpers';
import {
  createCellCanDrop,
  createCellMovableTile,
  createCellNoDrop,
  createCellWithNoTile,
  createCellWithTile,
  createCellWithTileAndDrop,
  createCellWithTileAndHistoricalMove,
  createCellWithTileNoDrop,
  createMoveListener,
  movingTile,
} from '../fixtures/game-cell.fixtures';
import { HiveDispatcher } from '@hive/services';
import { Dispatcher } from '@hive/hooks/useHiveDispatchListener';
import { Cell, HexCoordinate } from '@hive/domain';
import GameTile from '../../src/components/GameTile';
import { cellKey } from '@hive/utilities/hextille';
import { moveMap } from '@hive/services/game-state-context.ts';

const setUp = (...tileCreationFns: Array<() => { cell: Cell; historical?: boolean }>) => {
  const comps = tileCreationFns.map((t) => t());

  moveMap.value = new Map<`${number}-${number}`, HexCoordinate[]>();
  for (const t of comps.flatMap(({ cell }) => cell.tiles))
    moveMap.value.set(`${t.playerId}-${t.id}`, t.moves);

  const dispatcher = new HiveDispatcher();
  render(
    <Dispatcher.Provider value={dispatcher}>
      {comps.map(({ cell, historical }) => (
        <GameCell key={cellKey(cell.coords)} coords={cell.coords} historical={historical}>
          {cell.tiles.map((tile) => (
            <GameTile currentPlayer={1} {...tile} />
          ))}
        </GameCell>
      ))}
    </Dispatcher.Provider>
  );

  return dispatcher;
};

describe('<GameCell>', () => {
  it(`top tile is rendered when tiles are all empty`, async () => {
    setUp(createCellWithTile);
    expect(screen.getByTitle(/queen/)).toBeInTheDocument();
  });

  it(`shows cells with historical moves`, async () => {
    setUp(createCellWithTileAndHistoricalMove);

    expect(screen.getByRole('cell')).toHaveClass('historical');
  });
});

describe('<GameCell> drag events', () => {
  it('allows drop on dragover', async () => {
    setUp(createCellWithTile);

    const preventDefault = simulateEvent(screen.getByRole('cell'), 'dragover');

    expect(preventDefault).toHaveBeenCalledWith();
  });

  it('allows drop on drag start', async () => {
    setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);

    await userEvent.click(screen.getByTitle(/beetle/));
    const cells = await screen.findAllByRole('cell');

    await Promise.all(cells.slice(-1).map((c) => waitFor(() => expect(c).toHaveClass('can-drop'))));
  });

  it('is active on tile drag over', async () => {
    setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);
    const t = screen.getByTitle(/beetle/);
    await userEvent.click(t);

    for (const c of screen.getAllByRole('cell')) await userEvent.hover(c);

    await Promise.all(screen.getAllByRole('cell').map((c) => waitFor(() => expect(c).toHaveClass('active'))));
  });

  it('is no longer active on tile drag leave', async () => {
    setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);

    await userEvent.click(screen.getByTitle(/beetle/));

    for (const c of screen.getAllByRole('cell')) await userEvent.hover(c);
    for (const c of screen.getAllByRole('cell')) await userEvent.unhover(c);
    await Promise.all(
      screen.getAllByRole('cell').map((c) => waitFor(() => expect(c).not.toHaveClass('active')))
    );
  });

  it('calls move when tile is dropped on valid and active cell', async () => {
    const dispatcher = setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);
    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/beetle/));

    for (const c of screen.getAllByRole('cell')) await userEvent.hover(c);
    dispatcher.dispatch({
      type: 'tileDropped',
      tile: movingTile,
    });

    expect(moveEvents).toStrictEqual(
      expect.arrayContaining([
        {
          type: 'move',
          move: { tileId: 2, coords: { q: 0, r: 0 } },
        },
      ])
    );
  });

  it(`doesn't call move on drop when cell isn't valid`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellWithTile, createCellNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/beetle/));

    dispatcher.dispatch({
      type: 'tileDropped',
      tile: movingTile,
    });

    expect(moveEvents).toStrictEqual([]);
  });

  it(`doesn't call move on drop for invalid cells`, async () => {
    const dispatcher = setUp(createCellWithTileNoDrop, createCellNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    for (const c of screen.getAllByRole('cell')) await userEvent.hover(c);
    expect(moveEvents).toStrictEqual([]);
  });

  it('removes active classes on drag leave', async () => {
    setUp(createCellMovableTile, createCellWithTileNoDrop, createCellNoDrop);

    await userEvent.click(screen.getByTitle(/beetle/));

    for (const c of screen.getAllByRole('cell')) await userEvent.hover(c);
    for (const c of screen.getAllByRole('cell')) await userEvent.unhover(c);
    await Promise.all(
      screen.getAllByRole('cell').map((c) => waitFor(() => expect(c).not.toHaveClass('active')))
    );
  });

  it('removes active and can-drop classes on drop', async () => {
    const dispatcher = setUp(
      createCellMovableTile,
      createCellWithTile,
      createCellWithTileNoDrop,
      createCellNoDrop
    );

    await userEvent.click(screen.getByTitle(/beetle/));

    for (const c of screen.getAllByRole('cell')) await userEvent.hover(c);

    dispatcher.dispatch({
      type: 'tileDropped',
      tile: movingTile,
    });

    for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('active');
    for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('can-drop');
  });

  it(`doesn't stop event propagation when occupied cell has no active tile`, async () => {
    const dispatcher = setUp(createCellWithTileNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    await Promise.all(screen.getAllByRole('cell').map((c) => userEvent.click(c)));

    expect(moveEvents).toStrictEqual([]);
  });

  it(`makes a move when clicked with active tile`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);
    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/beetle/));
    const cells = await screen.findAllByRole('cell');
    await userEvent.click(cells[1]);
    expect(moveEvents).toStrictEqual(
      expect.arrayContaining([
        {
          type: 'move',
          move: { tileId: 2, coords: { q: 0, r: 0 } },
        },
      ])
    );
  });

  it(`doesn't move with no active tile on cell click`, async () => {
    const dispatcher = setUp(createCellNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    await Promise.all(screen.getAllByRole('cell').map((c) => userEvent.click(c)));

    expect(moveEvents).toStrictEqual([]);
  });

  it(`doesn't move with invalid tile on cell click`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/beetle/));
    const cells = await screen.findAllByRole('cell');
    await userEvent.click(cells[1]);

    expect(moveEvents).toStrictEqual([]);
  });
});

describe('<GameCell> dispatch events', () => {
  it(`dispatches move event when pressing enter`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);
    const moveEvents = createMoveListener(dispatcher);
    const tileCanMove = screen.getByTitle(/beetle/);

    await userEvent.click(tileCanMove);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    expect(moveEvents).toStrictEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
  });

  it(`dispatches move event when pressing space`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);

    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/beetle/));
    await userEvent.tab();
    await userEvent.keyboard(' ');

    expect(moveEvents).toStrictEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
  });

  it.each([
    '{backspace}',
    '{esc}',
    '{del}',
    '{selectall}',
    '{arrowleft}',
    '{arrowright}',
    '{arrowup}',
    '{arrowdown}',
    '{home}',
    '{end}',
    '{shift}',
    '{ctrl}',
    '{alt}',
    '{meta}',
    '{capslock}',
    ...Array.from({ length: 79 })
      .map((_, index) => String.fromCodePoint(index + 48))
      .map((key) => key.replaceAll('{', '{{').replaceAll('[', '[[')),
  ])(`doesn't emit move event for key %s`, async (key) => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);

    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/beetle/));
    const cells = await screen.findAllByRole('cell');
    cells[1].focus();
    await userEvent.keyboard(key);

    expect(moveEvents).toStrictEqual([]);
  });
});

describe('<GameCell> snapshots', () => {
  it('matches cell with tile', () => {
    setUp(createCellWithTile);
    expect(screen.getByRole('cell')).toMatchSnapshot();
  });

  it('matches cell with no tile', () => {
    setUp(createCellWithNoTile);
    expect(screen.getByRole('cell')).toMatchSnapshot();
  });
});
