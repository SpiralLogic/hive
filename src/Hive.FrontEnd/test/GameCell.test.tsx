import { fireEvent, render, screen } from '@testing-library/preact';
import { h } from 'preact';
import userEvent, { specialChars } from '@testing-library/user-event';
import { useHiveDispatcher } from '../src/utilities/dispatcher';
import GameCell from '../src/components/GameCell';
import { simulateEvent } from './test-helpers';
import {
  createCellCanDrop,
  createCellNoDrop,
  createCellWithNoTile,
  createCellWithTile,
  createCellWithTileAndDrop,
  createCellWithTileNoDrop,
  createDispatcher,
  emitHiveEvent,
  moveTileSpy,
} from './fixtures/gameCell.fixtures';

describe('cell Tests', () => {
  it(`top tile is rendered when tiles isn't empty`, () => {
    render(<GameCell {...createCellWithTile()} />);
    expect(screen.getByTitle(/fly/)).toBeInTheDocument();
  });

  describe('drag and drop', () => {
    it('dragover allows drop', () => {
      render(<GameCell {...createCellWithTile()} />);
      const preventDefault = simulateEvent(screen.getByRole('cell'), 'dragover');
      expect(preventDefault).toHaveBeenCalledWith();
    });

    it('cell is available on drag start', () => {
      render(<GameCell {...createCellWithTileAndDrop()} />);
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');

      screen.getAllByRole('cell').forEach((c) => expect(c).toHaveClass('can-drop'));
    });

    it('available cell is active on tile drag enter', () => {
      render(<GameCell {...createCellWithTileAndDrop()} />);
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');

      screen.getAllByRole('cell').forEach((c) => fireEvent.dragEnter(c));
      screen.getAllByRole('cell').forEach((c) => expect(c).toHaveClass('active'));
    });

    it('available cell is no longer active on tile drag leave', () => {
      render(<GameCell {...createCellWithTileAndDrop()} />);
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      screen.getAllByRole('cell').forEach((c) => fireEvent.dragEnter(c));
      screen.getAllByRole('cell').forEach((c) => fireEvent.dragLeave(c));
      screen.getAllByRole('cell').forEach((c) => expect(c).not.toHaveClass('active'));
    });

    it('move calls moves tile when cell is valid and active', () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellWithTileAndDrop()} />);
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      screen.getAllByRole('cell').forEach((c) => fireEvent.dragEnter(c));
      emitHiveEvent('tileDropped');

      expect(moveEvents).toEqual(
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

    it(`drop doesn't call move tile when cell doesn't allow drop`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellWithTile()} />);
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      emitHiveEvent('tileDropped');

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith({ type: 'move' });
    });

    it(`invalid cells don't call move tile on drop`, () => {
      render(<GameCell {...createCellWithTileNoDrop()} />);
      render(<GameCell {...createCellNoDrop()} />);
      screen.getAllByRole('cell').forEach((c) => fireEvent.dragEnter(c));
      expect(moveTileSpy).not.toHaveBeenCalledWith();
    });

    it('active classes are removed on drag leave', () => {
      createCellWithTile();
      createCellWithNoTile();
      render(<GameCell {...createCellWithTileNoDrop()} />);
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');

      screen.getAllByRole('cell').forEach((c) => fireEvent.dragEnter(c));
      screen.getAllByRole('cell').forEach((c) => fireEvent.dragLeave(c));
      screen.getAllByRole('cell').forEach((c) => expect(c).not.toHaveClass('active'));
    });

    it('active and can-drop classes are removed on drop', () => {
      render(<GameCell {...createCellWithTile()} />);
      createCellWithNoTile();
      render(<GameCell {...createCellWithTileNoDrop()} />);
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      screen.getAllByRole('cell').forEach((c) => fireEvent.dragEnter(c));
      emitHiveEvent('tileDropped');
      emitHiveEvent('tileDeselected');

      screen.getAllByRole('cell').forEach((c) => expect(c).not.toHaveClass('active'));
      screen.getAllByRole('cell').forEach((c) => expect(c).not.toHaveClass('can-drop'));
    });

    it(`occupied cell with no active tile doesn't stop event propagation'`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellWithTileAndDrop()} />);
      screen.getAllByRole('cell').forEach((c) => userEvent.click(c));

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`cell click with active tile makes a move`, async () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      (await screen.findAllByRole('cell')).forEach((c) => userEvent.click(c));

      expect(moveEvents).toEqual(
        expect.arrayContaining([
          {
            type: 'move',
            move: { tileId: 2, coords: { q: 0, r: 0 } },
          },
        ])
      );
    });

    it(`cell click with no active tile shouldn't move`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellNoDrop()} />);
      screen.getAllByRole('cell').forEach((c) => userEvent.click(c));

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`cell click with invalid tile shouldn't move`, async () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      (await screen.findAllByRole('cell')).forEach((c) => userEvent.click(c));

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`enter fires emit event on keydown enter`, async () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      (await screen.findAllByRole('cell')).forEach((c) => userEvent.type(c, '{enter}'));

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    it(`space fires emit event on keydown enter`, async () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      (await screen.findAllByRole('cell')).forEach((c) => userEvent.type(c, ' '));

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    it(`other keys dont emit tile start event`, async () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      userEvent.type(await screen.findByRole('cell'), 'j');

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it('cell with tile matches current snapshot', () => {
      render(<GameCell {...createCellWithTile()} />);
      expect(screen.getByRole('cell')).toMatchSnapshot();
    });

    it('cell with no tile matches current snapshot', () => {
      render(<GameCell {...createCellWithNoTile()} />);
      expect(screen.getByRole('cell')).toMatchSnapshot();
    });
  });
});
