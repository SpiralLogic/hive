import { GameId, Move } from '../../domain';
import { TileAction } from '../../services';
import {
  attachServerHandlers,
  handleDragOver,
  handleDrop,
  handleKeyboardNav,
  opponentSelectionHandler,
} from '../../utilities/handlers';
import { useHiveDispatcher } from '../../utilities/hooks';
import gameState from '../fixtures/gameState.json';

describe(`handler tests`, () => {
  const selectedTile = {
    id: 2,
    moves: [
      { q: 0, r: 0 },
      { q: 2, r: 2 },
    ],
    creature: '',
    playerId: 1,
  };
  describe(`handle drag tests`, () => {
    test('should prevent default on dragover', () => {
      const preventDefault = jest.fn();
      handleDragOver({ preventDefault });
      expect(preventDefault).toBeCalled();
    });

    test('should prevent default ondrop', () => {
      const preventDefault = jest.fn();
      handleDrop({ preventDefault });
      expect(preventDefault).toBeCalled();
    });
  });

  describe(`handleKeyboardNav tests`, () => {
    let div1: HTMLDivElement, div2: HTMLDivElement, div3: HTMLDivElement, div4: HTMLDivElement;
    const container = document.createElement('span', {});
    document.body.appendChild(container);
    beforeEach(() => {
      container.innerHTML =
        "<div id='one' tabIndex='1'></div><div id='two' tabIndex='1'></div><div id='three' tabIndex='1'></div><div class='name'></div>";
      const elements = container.getElementsByTagName('div');
      [div1, div2, div3, div4] = Array.from(elements);
    });

    test('should move to next element on keydown', () => {
      expect(handleKeyboardNav({ key: 'ArrowDown', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should move to next element on key right', () => {
      expect(handleKeyboardNav({ key: 'ArrowRight', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should move to next element on key up', () => {
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should move to last element on key up from first', () => {
      jest.spyOn(div3, 'focus');
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div1 })).toBe(true);
      expect(div3.focus).toBeCalled();
      expect(div4).not.toHaveFocus();
    });

    test('should move to next element on key left', () => {
      expect(handleKeyboardNav({ key: 'ArrowLeft', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should not move on other keys', () => {
      expect(handleKeyboardNav({ key: 'n', target: div1 })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    test('should not move no target', () => {
      expect(handleKeyboardNav({ key: 'n', target: null })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
    });
  });

  describe(`server connection events`, () => {
    test(`opponent selection selects tile`, () => {
      const tile = { id: 1, playerId: 1, creature: 'swan', moves: [] };
      const dispatcher = useHiveDispatcher();
      const selectHandler = jest.fn();
      dispatcher.add<TileAction>('tileSelect', selectHandler);

      opponentSelectionHandler('select', tile);
      expect(selectHandler).toBeCalledWith({ type: 'tileSelect', tile });
    });

    test(`opponent deselection selects tile`, () => {
      const tile = { id: 1, playerId: 1, creature: 'swan', moves: [] };
      const dispatcher = useHiveDispatcher();
      const selectHandler = jest.fn();
      dispatcher.add<TileAction>('tileDeselect', selectHandler);

      opponentSelectionHandler('deselect', tile);
      expect(selectHandler).toBeCalledWith({ type: 'tileDeselect', tile });
    });

    test(`opponent deselection doesnt fire for missing tiles`, () => {
      const dispatcher = useHiveDispatcher();
      const selectHandler = jest.fn();
      const deselectHandler = jest.fn();
      dispatcher.add<TileAction>('tileDeselect', selectHandler);
      dispatcher.add<TileAction>('tileSelect', selectHandler);

      opponentSelectionHandler('select', null!);
      opponentSelectionHandler('deselect', null!);
      expect(selectHandler).not.toBeCalled();
      expect(deselectHandler).not.toBeCalled();
    });

    test(`server handlers are attached`, () => {
      const dispatcher = useHiveDispatcher();
      jest.spyOn(dispatcher, 'remove');
      const sendSelection = jest.fn();
      const moveTile = (gameId: GameId, move: Move) => Promise.resolve({ gameId: 'eer', ...gameState });

      const removeHandlers = attachServerHandlers(
        sendSelection,
        { gameId: '1', cells: [], players: [], gameStatus: 'Success' },
        jest.fn(),
        moveTile
      );

      dispatcher.dispatch({
        type: 'move',
        move: { tileId: 2, coords: { q: 0, r: 0 } },
      });

      dispatcher.dispatch({ type: 'tileSelected', tile: selectedTile });
      expect(sendSelection).toBeCalled();

      dispatcher.dispatch({ type: 'tileDeselected', tile: selectedTile });
      expect(sendSelection).toBeCalled();

      removeHandlers();
      expect(dispatcher.remove).toBeCalledTimes(3);
    });
  });
});
