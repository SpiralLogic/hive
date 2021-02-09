import { act, fireEvent, render } from '@testing-library/preact';
import { deepEqual } from 'fast-equals';
import { h } from 'preact';
import { renderElement, simulateEvent } from './helpers';
import { useHiveEventEmitter } from '../hooks';
import Cell from '../components/Cell';

jest.mock('fast-equals', () => ({ deepEqual: jest.fn(() => true) }));
describe('Cell', () => {
  const moveTileSpy = jest.fn();

  const createCellWithNoTile = () => {
    const cell = { coords: { q: 0, r: 0 }, tiles: [] };
    return renderElement(<Cell {...cell} />);
  };

  const createCellWithTile = () => {
    const tile = { id: 2, playerId: 2, creature: 'fly', moves: [] };
    const cell = { coords: { q: 1, r: 1 }, tiles: [tile] };

    return renderElement(<Cell {...cell} />);
  };

  const createCellWithTileAndDrop = () => {
    const tile = { id: 2, playerId: 2, creature: 'ant', moves: [{ r: 0, q: 0 }] };
    const cell = { coords: { q: 2, r: 2 }, tiles: [tile] };

    return renderElement(<Cell {...cell} />);
  };

  const createCellNoDrop = () => {
    const cell = { coords: { q: 6, r: 6 }, tiles: [] };
    return renderElement(<Cell {...cell} />);
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

    test('component is memorized with deep equal', () => {
      const props = { coords: { q: 0, r: 0 }, tiles: [] };
      const cell = <Cell {...props} />;
      render(cell).rerender(cell);
      expect(deepEqual).toHaveBeenCalledTimes(1);
    });
  });

  describe('drag and drop', () => {
    const emitter = useHiveEventEmitter();

    function emitHiveEvent(type: 'start' | 'end') {
      act(() =>
        emitter.emit({
          type,
          tile: {
            id: 2,
            moves: [
              { q: 0, r: 0 },
              { q: 2, r: 2 },
            ],
            creature: '',
            playerId: 1,
          },
        })
      );
    }

    test('dragover allows drop', () => {
      const preventDefault = simulateEvent(createCellWithTile(), 'dragover');
      expect(preventDefault).toHaveBeenCalled();
    });

    test('cell is valid on drag start', () => {
      const cellWithTile = createCellWithTileAndDrop();
      const emptyCell = createCellCanDrop();
      emitHiveEvent('start');

      expect(cellWithTile).toHaveClass('can-drop');
      expect(emptyCell).toHaveClass('can-drop');
    });

    test('valid cell is active on tile drag enter', () => {
      const cellWithTile = createCellWithTileAndDrop();
      const emptyCell = createCellCanDrop();
      emitHiveEvent('start');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);

      expect(cellWithTile).toHaveClass('active');
      expect(emptyCell).toHaveClass('active');
    });

    test('drop calls moves tile when valid and active', () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      const cellWithTile = createCellWithTileAndDrop();
      const emptyCell = createCellCanDrop();
      emitHiveEvent('start');
      fireEvent.dragEnter(cellWithTile);
      fireEvent.dragEnter(emptyCell);
      emitHiveEvent('end');

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith({
        type: 'move',
        move: { tileId: 2, coords: { q: 0, r: 0 } },
      });

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith({
        type: 'move',
        move: { tileId: 2, coords: { q: 2, r: 2 } },
      });
    });

    test(`drop doesnt call move tile when cell doesn't allow drop`, () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      createCellWithTileNoDrop();
      createCellNoDrop();
      emitHiveEvent('start');
      emitHiveEvent('end');

      expect(useHiveEventEmitter().emit).not.toHaveBeenCalledWith({ type: 'move' });
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
      emitHiveEvent('start');
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragLeave(c));

      expect(document.getElementsByClassName('active')).toHaveLength(0);
    });

    test('active and can-drop classes are removed on drop', () => {
      createCellWithTile();
      createCellWithNoTile();
      createCellWithTileNoDrop();
      createCellNoDrop();
      emitHiveEvent('start');
      document.querySelectorAll('.cell').forEach((c) => fireEvent.dragEnter(c));
      emitHiveEvent('end');

      expect(document.getElementsByClassName('active')).toHaveLength(0);
      expect(document.getElementsByClassName('can-drop')).toHaveLength(0);
    });

    test(`occupied cell with no active tile doesn't stop event propagation'`, () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      const cellWithTile = createCellWithTileAndDrop();
      fireEvent.click(cellWithTile);

      expect(useHiveEventEmitter().emit).not.toBeCalled();
    });

    test(`cell click with active tile makes a move`, () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      jest.spyOn(useHiveEventEmitter(), 'emit');
      const emptyCell = createCellCanDrop();
      emitHiveEvent('start');
      fireEvent.click(emptyCell);

      expect(useHiveEventEmitter().emit).toHaveBeenCalledWith({
        type: 'move',
        move: { tileId: 2, coords: { q: 0, r: 0 } },
      });
      expect(useHiveEventEmitter().emit).toBeCalled();
    });

    test(`cell click with no active tile shouldn't drop`, () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      const emptyCell = createCellNoDrop();
      fireEvent.click(emptyCell);

      expect(useHiveEventEmitter().emit).not.toHaveBeenCalledWith();
    });

    test(`cell click with invalid tile shouldn't drop`, () => {
      jest.spyOn(useHiveEventEmitter(), 'emit');
      const emptyCell = createCellNoDrop();
      emitHiveEvent('start');
      fireEvent.click(emptyCell);

      expect(useHiveEventEmitter().emit).not.toHaveBeenCalledWith();
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
