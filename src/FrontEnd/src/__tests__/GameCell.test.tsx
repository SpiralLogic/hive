import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { useHiveDispatcher } from '../utilities/dispatcher';
import GameCell from '../components/GameCell';
import { renderElement, simulateEvent } from './test-helpers';
import {
  createCellCanDrop,
  createCellNoDrop,
  createCellWithNoTile,
  createCellWithTile,
  createCellWithTileAndDrop,
  createCellWithTileNoDrop,
  createEmitter,
  emitHiveEvent,
  moveTileSpy,
} from './fixtures/gameCell.fixtures';

describe('cell Tests', () => {
  it(`top tile is rendered when tiles isn't empty`, () => {
    const tiles = renderElement(<GameCell {...createCellWithTile()} />).getElementsByClassName('tile');
    expect(tiles).toHaveLength(1);
  });

  describe('drag and drop', () => {
    it('dragover allows drop', () => {
      const preventDefault = simulateEvent(renderElement(<GameCell {...createCellWithTile()} />), 'dragover');
      expect(preventDefault).toHaveBeenCalledWith();
    });

    it('cell is available on drag start', () => {
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');

      expect(cellWithTile).toHaveClass('can-drop');
      expect(emptyCell).toHaveClass('can-drop');
    });

    it('available cell is active on tile drag enter', () => {
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);

      expect(cellWithTile).toHaveClass('active');
      expect(emptyCell).toHaveClass('active');
    });

    it('available cell is no longer active on tile drag leave', () => {
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);
      fireEvent.dragLeave(cellWithTile);
      fireEvent.dragLeave(emptyCell);

      expect(cellWithTile).not.toHaveClass('active');
      expect(emptyCell).not.toHaveClass('active');
    });

    it('move calls moves tile when cell is valid and active', () => {
      const moveEvents = createEmitter();
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);
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
      renderElement(<GameCell {...createCellWithTile()} />);
      renderElement(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      emitHiveEvent('tileDropped');

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith({ type: 'move' });
    });

    it(`invalid cells don't call move tile on drop`, () => {
      renderElement(<GameCell {...createCellWithTileNoDrop()} />);
      renderElement(<GameCell {...createCellNoDrop()} />);
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));

      expect(moveTileSpy).not.toHaveBeenCalledWith();
    });

    it('active classes are removed on drag leave', () => {
      createCellWithTile();
      createCellWithNoTile();
      renderElement(<GameCell {...createCellWithTileNoDrop()} />);
      renderElement(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');

      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragLeave(c));

      expect(document.getElementsByClassName('active')).toHaveLength(0);
    });

    it('active and can-drop classes are removed on drop', () => {
      renderElement(<GameCell {...createCellWithTile()} />);
      createCellWithNoTile();
      renderElement(<GameCell {...createCellWithTileNoDrop()} />);
      renderElement(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));
      emitHiveEvent('tileDropped');
      emitHiveEvent('tileDeselected');

      expect(document.getElementsByClassName('active')).toHaveLength(0);
      expect(document.getElementsByClassName('can-drop')).toHaveLength(0);
    });

    it(`occupied cell with no active tile doesn't stop event propagation'`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      fireEvent.click(cellWithTile);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`cell click with active tile makes a move`, () => {
      const moveEvents = createEmitter();
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.click(emptyCell);

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
      const emptyCell = renderElement(<GameCell {...createCellNoDrop()} />);
      fireEvent.click(emptyCell);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`cell click with invalid tile shouldn't move`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = renderElement(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.click(emptyCell);
      fireEvent.click(emptyCell);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    it(`enter fires emit event on keydown enter`, () => {
      const moveEvents = createEmitter();
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.keyDown(emptyCell, { key: 'Enter' });

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    it(`space fires emit event on keydown enter`, () => {
      const moveEvents = createEmitter();
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.keyDown(emptyCell, { key: ' ' });

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    it(`other keys dont emits tile start event`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.keyDown(renderElement(<GameCell {...createCellCanDrop()} />), { key: 'Tab' });

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });
    it('cell with tile matches current snapshot', () => {
      expect(renderElement(<GameCell {...createCellWithTile()} />)).toMatchSnapshot();
    });

    it('cell with no tile matches current snapshot', () => {
      expect(renderElement(<GameCell {...createCellWithNoTile()} />)).toMatchSnapshot();
    });
  });
});
