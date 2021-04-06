import { GameState } from '../../domain';
import { Action, AiAction, HiveEvent, TileAction, TileEvent } from '../../services';
import {
  attachServerHandlers,
  handleDragOver,
  handleDrop,
  handleKeyboardNav,
  opponentConnectedHandler,
  opponentSelectionHandler,
} from '../../utilities/handlers';
import { useHiveDispatcher } from '../../utilities/dispatcher';
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
    it('should prevent default on dragover', () => {
      const preventDefault = jest.fn();
      handleDragOver({ preventDefault });
      expect(preventDefault).toHaveBeenCalledWith();
    });

    it('should prevent default ondrop', () => {
      const preventDefault = jest.fn();
      handleDrop({ preventDefault });
      expect(preventDefault).toHaveBeenCalledWith();
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

    it('should move to next element on keydown', () => {
      expect(handleKeyboardNav({ key: 'ArrowDown', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('should move to next element on key right', () => {
      expect(handleKeyboardNav({ key: 'ArrowRight', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('should move to next element on key up', () => {
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('should move to last element on key up from first', () => {
      jest.spyOn(div3, 'focus');
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div1 })).toBe(true);
      expect(div3.focus).toHaveBeenCalledWith();
      expect(div4).not.toHaveFocus();
    });

    it('should move to next element on key left', () => {
      expect(handleKeyboardNav({ key: 'ArrowLeft', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('should not move on other keys', () => {
      expect(handleKeyboardNav({ key: 'n', target: div1 })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('should not move no target', () => {
      expect(handleKeyboardNav({ key: 'n', target: null })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
    });
  });

  describe(`server connection events`, () => {
    it(`opponent selection selects tile`, () => {
      const tile = { id: 1, playerId: 1, creature: 'swan', moves: [] };
      const dispatcher = useHiveDispatcher();
      const selectHandler = jest.fn();
      dispatcher.add<TileAction>('tileSelect', selectHandler);

      opponentSelectionHandler('select', tile);
      expect(selectHandler).toHaveBeenCalledWith({ type: 'tileSelect', tile });
    });

    it(`opponent deselection selects tile`, () => {
      const tile = { id: 1, playerId: 1, creature: 'swan', moves: [] };
      const dispatcher = useHiveDispatcher();
      const selectHandler = jest.fn();
      dispatcher.add<Action>('tileClear', selectHandler);

      opponentSelectionHandler('deselect', tile);
      expect(selectHandler).toHaveBeenCalledWith({ type: 'tileClear' });
    });

    it(`opponent deselection doesnt fire for missing tiles`, () => {
      const dispatcher = useHiveDispatcher();
      const selectHandler = jest.fn();
      const deselectHandler = jest.fn();
      dispatcher.add<TileAction>('tileDeselect', selectHandler);
      dispatcher.add<TileAction>('tileSelect', selectHandler);

      opponentSelectionHandler('select', null!);
      opponentSelectionHandler('deselect', null!);
      opponentSelectionHandler(null!, null!);
      expect(selectHandler).not.toHaveBeenCalledWith();
      expect(deselectHandler).not.toHaveBeenCalledWith();
    });

    it(`opponent connected handler`, () => {
      const dispatcher = useHiveDispatcher();
      const connectedHandler = jest.fn();
      const toggleAiHandler = jest.fn();
      dispatcher.add<HiveEvent>('opponentConnected', connectedHandler);
      dispatcher.add<AiAction>('toggleAi', toggleAiHandler);

      opponentConnectedHandler('connect');
      expect(connectedHandler).toHaveBeenCalledWith({ type: 'opponentConnected' });
      expect(toggleAiHandler).toHaveBeenCalledWith({ type: 'toggleAi', newState: false });
    });

    it(`opponent disconnected handler`, () => {
      const dispatcher = useHiveDispatcher();
      const disconnectedHandler = jest.fn();
      dispatcher.add<HiveEvent>('opponentDisconnected', disconnectedHandler);

      opponentConnectedHandler('disconnect');
      expect(disconnectedHandler).toHaveBeenCalledWith({ type: 'opponentDisconnected' });
    });

    it(`opponent connect handler default`, () => {
      const dispatcher = useHiveDispatcher();
      const disconnectedHandler = jest.fn();
      const connectedHandler = jest.fn();
      dispatcher.add<HiveEvent>('opponentDisconnected', disconnectedHandler);
      dispatcher.add<HiveEvent>('opponentConnected', connectedHandler);

      opponentConnectedHandler(null!);
      expect(disconnectedHandler).not.toHaveBeenCalled();
      expect(connectedHandler).not.toHaveBeenCalled();
    });

    it(`server handlers are attached`, () => {
      const dispatcher = useHiveDispatcher();
      jest.spyOn(dispatcher, 'remove');
      const sendSelection = jest.fn();
      const moveTile = () => Promise.resolve(gameState as GameState);

      const removeHandlers = attachServerHandlers(
        sendSelection,
        { gameId: '1', cells: [], players: [], gameStatus: 'MoveSuccess' },
        jest.fn(),
        moveTile
      );

      dispatcher.dispatch({
        type: 'move',
        move: { tileId: 2, coords: { q: 0, r: 0 } },
      });

      dispatcher.dispatch({ type: 'tileSelected', tile: selectedTile });
      expect(sendSelection).toHaveBeenLastCalledWith('select', selectedTile);

      dispatcher.dispatch({ type: 'tileDeselected', tile: selectedTile });
      expect(sendSelection).toHaveBeenLastCalledWith('deselect', selectedTile);

      removeHandlers();
      expect(dispatcher.remove).toHaveBeenCalledTimes(4);
    });
  });
});
