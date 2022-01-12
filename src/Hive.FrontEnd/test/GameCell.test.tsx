import { fireEvent, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { getHiveDispatcher } from '../src/utilities/dispatcher';
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
} from './fixtures/game-cell.fixtures';

describe('<GameCell>', () => {
  it(`top tile is rendered when tiles are all empty`, () => {
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

      for (const c of screen.getAllByRole('cell')) expect(c).toHaveClass('can-drop');
    });

    it('available cell is active on tile drag enter', () => {
      render(<GameCell {...createCellWithTileAndDrop()} />);
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');

      for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
      for (const c of screen.getAllByRole('cell')) expect(c).toHaveClass('active');
    });

    it('available cell is no longer active on tile drag leave', () => {
      render(<GameCell {...createCellWithTileAndDrop()} />);
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
      for (const c of screen.getAllByRole('cell')) fireEvent.dragLeave(c);
      for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('active');
    });

    it('move calls moves tile when cell is valid and active', () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellWithTileAndDrop()} />);
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
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
      jest.spyOn(getHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellWithTile()} />);
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      emitHiveEvent('tileDropped');

      expect(getHiveDispatcher().dispatch).not.toHaveBeenCalledWith({ type: 'move' });
    });

    it(`invalid cells don't call move tile on drop`, () => {
      render(<GameCell {...createCellWithTileNoDrop()} />);
      render(<GameCell {...createCellNoDrop()} />);
      for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
      expect(moveTileSpy).not.toHaveBeenCalledWith();
    });

    it('active classes are removed on drag leave', () => {
      createCellWithTile();
      createCellWithNoTile();
      render(<GameCell {...createCellWithTileNoDrop()} />);
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');

      for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
      for (const c of screen.getAllByRole('cell')) fireEvent.dragLeave(c);
      for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('active');
    });

    it('active and can-drop classes are removed on drop', () => {
      render(<GameCell {...createCellWithTile()} />);
      createCellWithNoTile();
      render(<GameCell {...createCellWithTileNoDrop()} />);
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      for (const c of screen.getAllByRole('cell')) fireEvent.dragEnter(c);
      emitHiveEvent('tileDropped');
      emitHiveEvent('tileDeselected');

      for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('active');
      for (const c of screen.getAllByRole('cell')) expect(c).not.toHaveClass('can-drop');
    });

    it(`occupied cell with no active tile doesn't stop event propagation'`, () => {
      jest.spyOn(getHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellWithTileAndDrop()} />);
      for (const c of screen.getAllByRole('cell')) userEvent.click(c);

      expect(getHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`cell click with active tile makes a move`, async () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      for (const c of await screen.findAllByRole('cell')) userEvent.click(c);

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
      jest.spyOn(getHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellNoDrop()} />);
      for (const c of screen.getAllByRole('cell')) userEvent.click(c);

      expect(getHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`cell click with invalid tile shouldn't move`, async () => {
      jest.spyOn(getHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      for (const c of await screen.findAllByRole('cell')) userEvent.click(c);

      expect(getHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`enter fires emit event on keydown enter`, async () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      for (const c of await screen.findAllByRole('cell')) userEvent.type(c, '{enter}');

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    it(`space fires emit event on keydown enter`, async () => {
      const moveEvents = createDispatcher();
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      for (const c of await screen.findAllByRole('cell')) userEvent.type(c, ' ');

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    it(`other keys dont emit tile start event`, async () => {
      jest.spyOn(getHiveDispatcher(), 'dispatch');
      render(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      userEvent.type(await screen.findByRole('cell'), 'j');

      expect(getHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
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
