import { screen } from '@testing-library/preact';
import { Action, HiveDispatcher, HiveEvent, TileAction } from '../../../src/services';
import {
  addServerHandlers,
  createOpponentConnectedHandler,
  createOpponentSelectionHandler,
  handleDragOver,
  handleDrop,
  handleKeyboardNav,
} from '../../../src/utilities/handlers';
import gameState from '../../fixtures/game-state.json';
import GameEngine from '../../../src/services/game-engine';

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
      const preventDefault = vi.fn();
      handleDragOver({ preventDefault });
      expect(preventDefault).toHaveBeenCalledWith();
    });

    it('should prevent default ondrop', () => {
      const preventDefault = vi.fn();
      handleDrop({ preventDefault });
      expect(preventDefault).toHaveBeenCalledWith();
    });
  });

  describe(`handleKeyboardNav tests`, () => {
    let div1: HTMLElement, div2: HTMLElement, div3: HTMLElement, div4: HTMLElement;
    const container = document.createElement('span', {});
    document.body.append(container);
    beforeEach(() => {
      container.innerHTML =
        "<div title='div one' tabIndex='1'></div><div title='div two' tabIndex='1'></div><div title='div three' tabIndex='1'></div><div title='div' class='name'></div>";
      const elements = screen.getAllByTitle(/div/);
      [div1, div2, div3, div4] = [...elements];
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
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div1 })).toBe(true);
      expect(div3).toHaveFocus();
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

    it('should not move target', () => {
      expect(handleKeyboardNav({ key: 'n', target: null })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
    });
  });

  describe(`server connection events`, () => {
    it(`opponent selection selects tile`, () => {
      const tile = { id: 1, playerId: 1, creature: 'swan', moves: [] };
      const dispatcher = new HiveDispatcher();
      const selectHandler = vi.fn();
      dispatcher.add<TileAction>('tileSelect', selectHandler);

      createOpponentSelectionHandler(dispatcher)('select', tile);
      expect(selectHandler).toHaveBeenCalledWith({ type: 'tileSelect', tile });
    });

    it(`opponent deselection selects tile`, () => {
      const tile = { id: 1, playerId: 1, creature: 'swan', moves: [] };
      const dispatcher = new HiveDispatcher();
      const selectHandler = vi.fn();
      dispatcher.add<Action>('tileClear', selectHandler);

      createOpponentSelectionHandler(dispatcher)('deselect', tile);
      expect(selectHandler).toHaveBeenCalledWith({ type: 'tileClear' });
    });

    it(`opponent deselection doesnt fire for missing tiles`, () => {
      const dispatcher = new HiveDispatcher();
      const selectHandler = vi.fn();
      const deselectHandler = vi.fn();
      dispatcher.add<TileAction>('tileDeselect', selectHandler);
      dispatcher.add<TileAction>('tileSelect', selectHandler);

      createOpponentSelectionHandler(dispatcher)('select', selectedTile);
      createOpponentSelectionHandler(dispatcher)('deselect', selectedTile);
      createOpponentSelectionHandler(dispatcher)('deselect', selectedTile);
      expect(selectHandler).not.toHaveBeenCalledWith();
      expect(deselectHandler).not.toHaveBeenCalledWith();
    });

    it(`opponent connected handler`, () => {
      const dispatcher = new HiveDispatcher();
      const connectedHandler = vi.fn();
      dispatcher.add<HiveEvent>('opponentConnected', connectedHandler);

      createOpponentConnectedHandler(dispatcher)('connect', 0);
      expect(connectedHandler).toHaveBeenCalledWith({ type: 'opponentConnected', playerId: 0 });
    });

    it(`opponent disconnected handler`, () => {
      const dispatcher = new HiveDispatcher();
      const disconnectedHandler = vi.fn();
      dispatcher.add<HiveEvent>('opponentDisconnected', disconnectedHandler);

      createOpponentConnectedHandler(dispatcher)('disconnect', 0);
      expect(disconnectedHandler).toHaveBeenCalledWith({ type: 'opponentDisconnected', playerId: 0 });
    });

    it(`server handlers are attached`, () => {
      global.fetch = vi
        .fn()
        .mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(gameState) }));
      const engine = new GameEngine();
      const dispatcher = new HiveDispatcher();
      vi.spyOn(dispatcher, 'remove');
      const sendSelection = vi.fn();

      const removeHandlers = addServerHandlers(sendSelection, vi.fn(), engine.move, dispatcher);

      dispatcher.dispatch({
        type: 'move',
        move: { tileId: 2, coords: { q: 0, r: 0 } },
      });

      dispatcher.dispatch({ type: 'tileSelected', tile: selectedTile });
      expect(sendSelection).toHaveBeenLastCalledWith('select', selectedTile);

      dispatcher.dispatch({ type: 'tileDeselected', tile: selectedTile });
      expect(sendSelection).toHaveBeenLastCalledWith('deselect', selectedTile);

      removeHandlers();
      expect(dispatcher.remove).toHaveBeenCalledTimes(3);
    });
  });
});
