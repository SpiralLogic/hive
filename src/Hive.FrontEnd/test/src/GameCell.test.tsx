import { fireEvent, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { ComponentProps } from 'preact';
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
import { HiveDispatcher } from '../../src/services';
import { Dispatcher } from '../../src/hooks/useHiveDispatchListener';

const setUp = (...tileCreationFns: Array<() => ComponentProps<typeof GameCell>>) => {
  const dispatcher = new HiveDispatcher();
  render(
    <Dispatcher.Provider value={dispatcher}>
      {tileCreationFns.map((factory) => (
        <GameCell key={factory} {...factory()} />
      ))}
    </Dispatcher.Provider>
  );
  return dispatcher;
};

describe('<GameCell>', () => {
  it(`top tile is rendered when tiles are all empty`, async () => {
    setUp(createCellWithTile);
    expect(screen.getByTitle(/fly/)).toBeInTheDocument();
  });

  it(`shows cells with historical moves`, async () => {
    setUp(createCellWithTileAndHistoricalMove);

    expect(screen.getByRole('cell')).toHaveClass('historical');
  });

  it('allows drop on dragover', async () => {
    setUp(createCellWithTile);
    const preventDefault = simulateEvent(screen.getByRole('cell'), 'dragover');
    expect(preventDefault).toHaveBeenCalledWith();
  });

  it('is available on drag start', async () => {
    setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);
    await userEvent.click(screen.getByTitle(/tilecanmove/));
    const cells = await screen.findAllByRole('cell');
    await Promise.all(cells.slice(1).map((c) => waitFor(() => expect(c).toHaveClass('can-drop'))));
  });

  it('is active on tile drag enter', async () => {
    setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);

    await userEvent.click(screen.getByTitle(/tilecanmove/));

    for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);

    await Promise.all(screen.getAllByRole('cell').map((c) => waitFor(() => expect(c).toHaveClass('active'))));
  });

  it('is no longer active on tile drag leave', async () => {
    setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);

    await userEvent.click(screen.getByTitle(/tilecanmove/));

    for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
    for (const c of screen.getAllByRole('cell')) fireEvent.dragLeave(c);
    await Promise.all(
      screen.getAllByRole('cell').map((c) => waitFor(() => expect(c).not.toHaveClass('active')))
    );
  });

  it('calls move when cell is valid and active for tile being dragged', async () => {
    const dispatcher = setUp(createCellMovableTile, createCellWithTileAndDrop, createCellCanDrop);
    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/tilecanmove/));

    for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
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
        {
          type: 'move',
          move: { tileId: 2, coords: { q: 2, r: 2 } },
        },
      ])
    );
  });

  it(`doesn't call move tile on drop when cell doesn't allow drop`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellWithTile, createCellNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/tilecanmove/));

    dispatcher.dispatch({
      type: 'tileDropped',
      tile: movingTile,
    });

    expect(moveEvents).toStrictEqual([]);
  });

  it(`don't call move tile on drop for invalid cells`, async () => {
    const dispatcher = setUp(createCellWithTileNoDrop, createCellNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
    expect(moveEvents).toStrictEqual([]);
  });

  it('removes active classes on drag leave', async () => {
    setUp(createCellMovableTile, createCellWithTileNoDrop, createCellNoDrop);

    await userEvent.click(screen.getByTitle(/tilecanmove/));

    for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
    for (const c of screen.getAllByRole('cell')) fireEvent.dragLeave(c);
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

    await userEvent.click(screen.getByTitle(/tilecanmove/));

    for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);

    dispatcher.dispatch({
      type: 'tileDropped',
      tile: movingTile,
    });

    dispatcher.dispatch({
      type: 'tileDeselected',
      tile: movingTile,
    });

    dispatcher.dispatch({
      type: 'tileDeselected',
      tile: movingTile,
    });

    for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('active');
    for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('can-drop');
  });

  it(`doesn't stop event propagation when occupied cell has no active tile '`, async () => {
    const dispatcher = setUp(createCellWithTileNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    await Promise.all(screen.getAllByRole('cell').map((c) => userEvent.click(c)));

    expect(moveEvents).toStrictEqual([]);
  });

  it(`makes a move when clicked with active tile`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);
    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/tilecanmove/));
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

  it(`shouldn't move with no active tile on cell click`, async () => {
    const dispatcher = setUp(createCellNoDrop);
    const moveEvents = createMoveListener(dispatcher);

    await Promise.all(screen.getAllByRole('cell').map((c) => userEvent.click(c)));

    expect(moveEvents).toStrictEqual([]);
  });

  it(`shouldn't move with invalid tile on cell click`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellNoDrop);

    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/tilecanmove/));
    const cells = await screen.findAllByRole('cell');
    await userEvent.click(cells[1]);
    expect(moveEvents).toStrictEqual([]);
  });

  it(`fires emit event when pressing enter`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);

    const moveEvents = createMoveListener(dispatcher);
    const tileCanMove = screen.getByTitle(/tilecanmove/);

    await userEvent.click(tileCanMove);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    expect(moveEvents).toStrictEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
  });

  it(`dispatches move event when pressing space`, async () => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);

    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/tilecanmove/));
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
      .map((c, index) => String.fromCodePoint(index + 48))
      .map((key) => key.replaceAll('{', '{{').replaceAll('[', '[[')),
  ])(`doesn't start drag event for key %s`, async (key) => {
    const dispatcher = setUp(createCellMovableTile, createCellCanDrop);

    const moveEvents = createMoveListener(dispatcher);

    await userEvent.click(screen.getByTitle(/tilecanmove/));
    const cells = await screen.findAllByRole('cell');
    cells[1].focus();
    await userEvent.keyboard(key);

    expect(moveEvents).toStrictEqual([]);
  });

  it('renders cell with tile', () => {
    setUp(createCellWithTile);
    expect(screen.getByRole('cell')).toMatchSnapshot();
  });

  it('renders cell with no tile', () => {
    setUp(createCellWithNoTile);
    expect(screen.getByRole('cell')).toMatchSnapshot();
  });
});
