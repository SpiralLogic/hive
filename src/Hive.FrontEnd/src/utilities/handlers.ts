import { GameState, Move, Tile } from '../domain';
import { OpponentConnectedHandler, OpponentSelectionHandler } from '../domain/engine';
import { AiAction, HiveDispatcher, MoveEvent, TileEvent } from '../services';

export function handleDragOver(event_: { preventDefault: () => void }): boolean {
  event_.preventDefault();
  return false;
}

export function handleDrop(event_: { preventDefault: () => void }): boolean {
  event_.preventDefault();
  return false;
}

export const isEnterOrSpace = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

const focusNext = (target: HTMLElement, direction: -1 | 1) => {
  const allTabbable = [...document.querySelectorAll('*[tabindex]:not(.name)')];
  let index = allTabbable.indexOf(target);
  if (index + direction < 0) index = allTabbable.length;
  (allTabbable[(index + direction) % allTabbable.length] as HTMLElement).focus();
};

export const handleKeyboardNav = (error: Pick<KeyboardEvent, 'key' | 'target'>): boolean => {
  if (error.target instanceof HTMLElement) {
    switch (error.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        focusNext(error.target, 1);
        return true;

      case 'ArrowUp':
      case 'ArrowLeft':
        focusNext(error.target, -1);
        return true;

      default:
        return false;
    }
  }
  return false;
};

export const createOpponentSelectionHandler = (dispatcher: HiveDispatcher): OpponentSelectionHandler => {
  return (type, tile) => {
    if (type === 'select') {
      dispatcher.dispatch({ type: 'tileSelect', tile });
    } else {
      dispatcher.dispatch({ type: 'tileClear' });
    }
  };
};
export const createOpponentConnectedHandler = (dispatcher: HiveDispatcher): OpponentConnectedHandler => {
  return (type) => {
    if (type === 'connect') {
      dispatcher.dispatch({ type: 'opponentConnected' });
      dispatcher.dispatch<AiAction>({ type: 'toggleAi', newState: 'off' });
    } else {
      dispatcher.dispatch({ type: 'opponentDisconnected' });
    }
  };
};

export const addServerHandlers = (
  sendSelection: (type: 'select' | 'deselect', tile: Tile) => void,
  updateGameState: (value: GameState) => void,
  makeMove: (move: Move) => Promise<GameState>,
  dispatcher: HiveDispatcher
) => {
  const selectionChangeHandler = (event: TileEvent) =>
    !event.fromEvent && sendSelection('select', event.tile);
  const deselectionChangeHandler = (event: TileEvent) =>
    !event.fromEvent && sendSelection('deselect', event.tile);
  const moveHandler = async (event: MoveEvent) => {
    const state = await makeMove(event.move);
    return updateGameState(state);
  };

  dispatcher.add<MoveEvent>('move', moveHandler);
  dispatcher.add<TileEvent>('tileSelected', selectionChangeHandler);
  dispatcher.add<TileEvent>('tileDeselected', deselectionChangeHandler);
  return () => {
    dispatcher.remove<MoveEvent>('move', moveHandler);
    dispatcher.remove<TileEvent>('tileSelected', selectionChangeHandler);
    dispatcher.remove<TileEvent>('tileDeselected', deselectionChangeHandler);
  };
};
