import { screen } from '@testing-library/preact';
import { HiveDispatcher } from '@hive/services';
import {
  addServerHandlers,
  createOpponentConnectedHandler,
  createOpponentSelectionHandler,
  handleDragOver,
  handleDrop,
  handleKeyboardNav,
} from '@hive/utilities/handlers';
import gameState from '../../fixtures/game-state.json';
import GameEngine from '../../../src/services/game-engine';
import { Tile } from '@hive/domain';

describe(`handler tests`, () => {
  const selectedTile: Tile = {
    id: 2,
    moves: [
      { q: 0, r: 0 },
      { q: 2, r: 2 },
    ],
    creature: 'spider',
    playerId: 1,
  };

  describe(`handle drag tests`, () => {
    it('prevents default on dragover', () => {
      const preventDefault = vi.fn();
      handleDragOver({ preventDefault });
      expect(preventDefault).toHaveBeenCalledWith();
    });

    it('prevents default ondrop', () => {
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

    it('moves to next element on keydown', () => {
      expect(handleKeyboardNav({ key: 'ArrowDown', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('moves to next element on key right', () => {
      expect(handleKeyboardNav({ key: 'ArrowRight', target: div1 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('moves to next element on key up', () => {
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('moves to last element on key up from first', () => {
      expect(handleKeyboardNav({ key: 'ArrowUp', target: div1 })).toBe(true);
      expect(div3).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('moves to next element on key left', () => {
      expect(handleKeyboardNav({ key: 'ArrowLeft', target: div3 })).toBe(true);
      expect(div2).toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it(`does not move on other keys`, () => {
      expect(handleKeyboardNav({ key: 'n', target: div1 })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
      expect(div4).not.toHaveFocus();
    });

    it('does not move target', () => {
      expect(handleKeyboardNav({ key: 'n', target: undefined })).toBe(false);
      expect(div1).not.toHaveFocus();
      expect(div2).not.toHaveFocus();
      expect(div3).not.toHaveFocus();
    });
  });

  describe(`server connection events`, () => {
    it(`selects tile on opponent selection`, () => {
      const tile: Tile = { id: 1, playerId: 1, creature: 'queen', moves: [] };
      const dispatcher = new HiveDispatcher();
      const selectHandler = vi.fn();
      dispatcher.add('tileSelect', selectHandler);

      createOpponentSelectionHandler(dispatcher)('select', tile);
      expect(selectHandler).toHaveBeenCalledWith({ type: 'tileSelect', tile });
    });

    it(`deselects tile on opponent deselection`, () => {
      const tile: Tile = { id: 1, playerId: 1, creature: 'queen', moves: [] };
      const dispatcher = new HiveDispatcher();
      const selectHandler = vi.fn();
      dispatcher.add('tileClear', selectHandler);

      createOpponentSelectionHandler(dispatcher)('deselect', tile);
      expect(selectHandler).toHaveBeenCalledWith({ type: 'tileClear' });
    });

    it(`doesn't fire opponent deselection for missing tiles`, () => {
      const dispatcher = new HiveDispatcher();
      const selectHandler = vi.fn();
      const deselectHandler = vi.fn();
      dispatcher.add('tileDeselect', selectHandler);
      dispatcher.add('tileSelect', selectHandler);

      createOpponentSelectionHandler(dispatcher)('select', selectedTile);
      createOpponentSelectionHandler(dispatcher)('deselect', selectedTile);
      createOpponentSelectionHandler(dispatcher)('deselect', selectedTile);
      expect(deselectHandler).not.toHaveBeenCalled();
    });

    it(`calls opponent connected handler`, () => {
      const dispatcher = new HiveDispatcher();
      const connectedHandler = vi.fn();
      dispatcher.add('opponentConnected', connectedHandler);

      createOpponentConnectedHandler(dispatcher)('connect', 0);
      expect(connectedHandler).toHaveBeenCalledWith({ type: 'opponentConnected', playerId: 0 });
    });

    it(`calls opponent disconnected handler`, () => {
      const dispatcher = new HiveDispatcher();
      const disconnectedHandler = vi.fn();
      dispatcher.add('opponentDisconnected', disconnectedHandler);

      createOpponentConnectedHandler(dispatcher)('disconnect', 0);
      expect(disconnectedHandler).toHaveBeenCalledWith({ type: 'opponentDisconnected', playerId: 0 });
    });

    it(`attaches server handlers`, () => {
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
