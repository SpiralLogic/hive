import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import {
  createCellCanDrop,
  createCellWithTileAndDrop,
  createCellWithTile,
  emitHiveEvent,
  createCellWithTileNoDrop,
  createCellNoDrop,
  moveTileSpy,
  createCellWithNoTile,
  createEmitter,
} from './fixtures/gameCell.fixtures';
import { renderElement, simulateEvent } from './helpers';
import { useHiveDispatcher } from '../utilities/hooks';
import GameCell from '../components/GameCell';

describe('Cell Tests', () => {
  test(`top tile is rendered when tiles isn't empty`, () => {
    const tiles = renderElement(<GameCell {...createCellWithTile()} />).getElementsByClassName('tile');
    expect(tiles).toHaveLength(1);
  });

  describe('drag and drop', () => {
    test('dragover allows drop', () => {
      const preventDefault = simulateEvent(renderElement(<GameCell {...createCellWithTile()} />), 'dragover');
      expect(preventDefault).toHaveBeenCalledWith();
    });

    test('cell is available on drag start', () => {
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');

      expect(cellWithTile).toHaveClass('can-drop');
      expect(emptyCell).toHaveClass('can-drop');
    });

    test('available cell is active on tile drag enter', () => {
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);

      expect(cellWithTile).toHaveClass('active');
      expect(emptyCell).toHaveClass('active');
    });

    test('available cell is no longer active on tile drag leave', () => {
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

    test('move calls moves tile when cell is valid and active', () => {
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

    test(`drop doesn't call move tile when cell doesn't allow drop`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      renderElement(<GameCell {...createCellWithTile()} />);
      renderElement(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      emitHiveEvent('tileDropped');

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith({ type: 'move' });
    });

    test(`invalid cells don't call move tile on drop`, () => {
      renderElement(<GameCell {...createCellWithTileNoDrop()} />);
      renderElement(<GameCell {...createCellNoDrop()} />);
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));

      expect(moveTileSpy).not.toHaveBeenCalledWith();
    });

    test('active classes are removed on drag leave', () => {
      createCellWithTile();
      createCellWithNoTile();
      renderElement(<GameCell {...createCellWithTileNoDrop()} />);
      renderElement(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');

      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragLeave(c));

      expect(document.getElementsByClassName('active')).toHaveLength(0);
    });

    test('active and can-drop classes are removed on drop', () => {
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

    test(`occupied cell with no active tile doesn't stop event propagation'`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const cellWithTile = renderElement(<GameCell {...createCellWithTileAndDrop()} />);
      fireEvent.click(cellWithTile);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    test(`cell click with active tile makes a move`, () => {
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

    test(`cell click with no active tile shouldn't move`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = renderElement(<GameCell {...createCellNoDrop()} />);
      fireEvent.click(emptyCell);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    test(`cell click with invalid tile shouldn't move`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = renderElement(<GameCell {...createCellNoDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.click(emptyCell);
      fireEvent.click(emptyCell);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    test(`enter fires emit event on keydown enter`, () => {
      const moveEvents = createEmitter();
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.keyDown(emptyCell, { key: 'Enter' });

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    test(`space fires emit event on keydown enter`, () => {
      const moveEvents = createEmitter();
      const emptyCell = renderElement(<GameCell {...createCellCanDrop()} />);
      emitHiveEvent('tileSelected');
      fireEvent.keyDown(emptyCell, { key: ' ' });

      expect(moveEvents).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'move' })]));
    });

    test(`other keys dont emits tile start event`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.keyDown(renderElement(<GameCell {...createCellCanDrop()} />), { key: 'Tab' });

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });
    test('cell with tile matches current snapshot', () => {
      expect(renderElement(<GameCell {...createCellWithTile()} />)).toMatchSnapshot();
    });

    test('cell with no tile matches current snapshot', () => {
      expect(renderElement(<GameCell {...createCellWithNoTile()} />)).toMatchSnapshot();
    });
  });
});
