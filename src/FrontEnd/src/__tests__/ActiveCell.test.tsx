import { act, fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { renderElement, simulateEvent } from './helpers';
import { useHiveDispatcher } from '../utilities/hooks';
import ActiveCell from '../components/ActiveCell';
import ActiveTile from '../components/ActiveTile';

jest.mock('fast-equals', () => ({ deepEqual: jest.fn(() => true) }));
describe('Cell Tests', () => {
  const moveTileSpy = jest.fn();

  const movingTile = {
    id: 2,
    moves: [
      { q: 0, r: 0 },
      { q: 2, r: 2 },
    ],
    creature: '',
    playerId: 1,
  };

  const createCellWithNoTile = () => {
    const cell = { coords: { q: 0, r: 0 }, tiles: [] };
    return renderElement(<ActiveCell {...cell} />);
  };

  const createCellWithTile = () => {
    const tile = { id: 2, playerId: 1, creature: 'fly', moves: [] };
    const cell = { coords: { q: 1, r: 1 }, children: <ActiveTile {...tile} /> };

    return renderElement(<ActiveCell {...cell} />);
  };

  const createCellWithTileAndDrop = () => {
    const tile = { id: 2, playerId: 1, creature: 'ant', moves: [{ r: 0, q: 0 }] };
    const cell = { coords: { q: 2, r: 2 }, children: <ActiveTile {...tile} /> };

    return renderElement(<ActiveCell {...cell} />);
  };

  const createCellNoDrop = () => {
    const cell = { coords: { q: 6, r: 6 }, tiles: [] };
    return renderElement(<ActiveCell {...cell} />);
  };

  const createCellCanDrop = createCellWithNoTile;
  const createCellWithTileNoDrop = createCellWithTile;

  describe('Cell render', () => {
    test('has default classes', () => {
      expect(createCellWithTile()).toHaveClass('hex cell');
      expect(createCellWithNoTile()).toHaveClass('hex cell');
    });

    test(`top tile is rendered when tiles isn't empty`, () => {
      const tiles = createCellWithTile().getElementsByClassName('tile');
      expect(tiles).toHaveLength(1);
    });
  });

  describe('drag and drop', () => {
    const emitter = useHiveDispatcher();

    function emitHiveEvent(type: 'tileSelected' | 'tileDropped' | 'tileDeselected') {
      act(() =>
        emitter.dispatch({
          type,
          tile: movingTile,
        })
      );
    }

    test('dragover allows drop', () => {
      const preventDefault = simulateEvent(createCellWithTile(), 'dragover');
      expect(preventDefault).toHaveBeenCalled();
    });

    test('cell is available on drag start', () => {
      const cellWithTile = createCellWithTileAndDrop();
      const emptyCell = createCellCanDrop();
      emitHiveEvent('tileSelected');

      expect(cellWithTile).toHaveClass('can-drop');
      expect(emptyCell).toHaveClass('can-drop');
    });

    test('available cell is active on tile drag enter', () => {
      const cellWithTile = createCellWithTileAndDrop();
      const emptyCell = createCellCanDrop();
      emitHiveEvent('tileSelected');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);

      expect(cellWithTile).toHaveClass('active');
      expect(emptyCell).toHaveClass('active');
    });

    test('move calls moves tile when cell is valid and active', () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const cellWithTile = createCellWithTileAndDrop();
      const emptyCell = createCellCanDrop();
      emitHiveEvent('tileSelected');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);
      emitHiveEvent('tileDropped');

      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith({
        type: 'move',
        move: { tileId: 2, coords: { q: 0, r: 0 } },
      });

      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith({
        type: 'move',
        move: { tileId: 2, coords: { q: 2, r: 2 } },
      });
    });

    test(`drop doesn't call move tile when cell doesn't allow drop`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      createCellWithTile();
      createCellNoDrop();
      emitHiveEvent('tileSelected');
      emitHiveEvent('tileDropped');

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith({ type: 'move' });
    });

    test(`invalid cells don't call move tile on drop`, () => {
      createCellWithTileNoDrop();
      createCellNoDrop();
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));

      expect(moveTileSpy).not.toHaveBeenCalled();
    });

    test('active classes are removed on drag leave', () => {
      createCellWithTile();
      createCellWithNoTile();
      createCellWithTileNoDrop();
      createCellNoDrop();
      emitHiveEvent('tileSelected');
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragLeave(c));

      expect(document.getElementsByClassName('active')).toHaveLength(0);
    });

    test('active and can-drop classes are removed on drop', () => {
      createCellWithTile();
      createCellWithNoTile();
      createCellWithTileNoDrop();
      createCellNoDrop();
      emitHiveEvent('tileSelected');
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));
      emitHiveEvent('tileDropped');
      emitHiveEvent('tileDeselected');

      expect(document.getElementsByClassName('active')).toHaveLength(0);
      expect(document.getElementsByClassName('can-drop')).toHaveLength(0);
    });

    test(`occupied cell with no active tile doesn't stop event propagation'`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const cellWithTile = createCellWithTileAndDrop();
      fireEvent.click(cellWithTile);

      expect(useHiveDispatcher().dispatch).not.toBeCalled();
    });

    test(`cell click with active tile makes a move`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = createCellCanDrop();
      emitHiveEvent('tileSelected');
      fireEvent.click(emptyCell);

      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith({
        type: 'move',
        move: { tileId: 2, coords: { q: 0, r: 0 } },
      });
      expect(useHiveDispatcher().dispatch).toBeCalled();
    });

    test(`cell click with no active tile shouldn't move`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = createCellNoDrop();
      fireEvent.click(emptyCell);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    test(`cell click with invalid tile shouldn't move`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = createCellNoDrop();
      emitHiveEvent('tileSelected');
      fireEvent.click(emptyCell);

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalledWith();
    });

    test(`enter fires emit event on keydown enter`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = createCellCanDrop();
      emitHiveEvent('tileSelected');
      fireEvent.keyDown(emptyCell, { key: 'Enter' });

      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'move' }));
    });

    test(`space fires emit event on keydown enter`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      const emptyCell = createCellCanDrop();
      emitHiveEvent('tileSelected');
      fireEvent.keyDown(emptyCell, { key: ' ' });

      expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'move' }));
    });

    test(`other keys dont emits tile start event`, () => {
      jest.spyOn(useHiveDispatcher(), 'dispatch');
      fireEvent.keyDown(createCellCanDrop(), { key: 'Tab' });

      expect(useHiveDispatcher().dispatch).not.toHaveBeenCalled();
    });
  });

  describe('Cell Snapshot', () => {
    test('cell with tile matches current snapshot', () => {
      expect(createCellWithTile()).toMatchSnapshot();
    });

    test('cell with no tile matches current snapshot', () => {
      expect(createCellWithNoTile()).toMatchSnapshot();
    });
  });
});
