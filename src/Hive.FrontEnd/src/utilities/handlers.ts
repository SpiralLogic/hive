import { GameId, GameState, Tile } from '../domain';
import { EngineMove, OpponentConnectedHandler, OpponentSelectionHandler } from '../domain/engine';
import { AiAction, MoveEvent, TileEvent } from '../services';
import { dispatchHiveEvent, getHiveDispatcher } from './dispatcher';

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

export const opponentSelectionHandler: OpponentSelectionHandler = (type, tile) => {
  switch (type) {
    case 'select':
      dispatchHiveEvent({ type: 'tileSelect', tile });
      break;
    default:
      dispatchHiveEvent({ type: 'tileClear' });
      break;
  }
};
export const opponentConnectedHandler: OpponentConnectedHandler = (type) => {
  switch (type) {
    case 'connect':
      dispatchHiveEvent({ type: 'opponentConnected' });
      dispatchHiveEvent<AiAction>({ type: 'toggleAi', newState: false });
      break;
    default:
      dispatchHiveEvent({ type: 'opponentDisconnected' });
      break;
  }
};

export const addServerHandlers = (
  sendSelection: (type: 'select' | 'deselect', tile: Tile) => void,
  gameId: GameId,
  updateGameState: (value: GameState) => void,
  move: EngineMove,
  useAi = false
) => {
  const selectionChangeHandler = (event: TileEvent) =>
    !event.fromEvent && sendSelection('select', event.tile);
  const deselectionChangeHandler = (event: TileEvent) =>
    !event.fromEvent && sendSelection('deselect', event.tile);
  const moveHandler = async (event: MoveEvent) => {
    const state = await move(gameId, event.move, useAi);
    return updateGameState(state);
  };
  const hiveDispatcher = getHiveDispatcher();

  hiveDispatcher.add<MoveEvent>('move', moveHandler);
  hiveDispatcher.add<TileEvent>('tileSelected', selectionChangeHandler);
  hiveDispatcher.add<TileEvent>('tileDeselected', deselectionChangeHandler);
  const removeAi = hiveDispatcher.add<AiAction>('toggleAi', ({ newState }) => (useAi = newState));
  return () => {
    hiveDispatcher.remove<MoveEvent>('move', moveHandler);
    hiveDispatcher.remove<TileEvent>('tileSelected', selectionChangeHandler);
    hiveDispatcher.remove<TileEvent>('tileDeselected', deselectionChangeHandler);
    removeAi();
  };
};
