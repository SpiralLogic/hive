import { AiAction, MoveEvent, TileEvent } from '../services';
import { EngineMove, OpponentConnectedHandler, OpponentSelectionHandler } from '../domain/engine';
import { GameState, Tile } from '../domain';
import { dispatchHiveEvent, useHiveDispatcher } from './dispatcher';

export function handleDragOver(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export function handleDrop(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export const isEnterOrSpace = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

const focusNext = (target: HTMLElement, direction: -1 | 1) => {
  const allTabbable = Array.from(document.querySelectorAll('*[tabindex]:not(.name)'));
  let index = allTabbable.indexOf(target);
  if (index + direction < 0) index = allTabbable.length;
  (allTabbable[(index + direction) % allTabbable.length] as HTMLElement).focus();
};

export const handleKeyboardNav = (e: Pick<KeyboardEvent, 'key' | 'target'>): boolean => {
  if (e.target instanceof HTMLElement) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        focusNext(e.target, 1);
        return true;
      case 'ArrowUp':
      case 'ArrowLeft':
        focusNext(e.target, -1);
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
    case 'deselect':
      dispatchHiveEvent({ type: 'tileDeselect', tile });
      break;
    default:
      break;
  }
};
export const opponentConnectedHandler: OpponentConnectedHandler = (type) => {
  switch (type) {
    case 'connect':
      dispatchHiveEvent({ type: 'opponentConnected' });
      dispatchHiveEvent<AiAction>({ type: 'toggleAi', newState: false });
      break;
    case 'disconnect':
      dispatchHiveEvent({ type: 'opponentDisconnected' });
      break;
    default:
      break;
  }
};

export const attachServerHandlers = (
  sendSelection: (type: 'select' | 'deselect', tile: Tile) => void,
  gameState: GameState,
  updateGameState: (value: GameState) => void,
  move: EngineMove,
  useAi: boolean = false
) => {
  const hiveDispatcher = useHiveDispatcher();

  const selectionChangeHandler = (event: TileEvent) => sendSelection('select', event.tile);
  const deselectionChangeHandler = (event: TileEvent) => sendSelection('deselect', event.tile);
  const moveHandler = async (event: MoveEvent) => {
    const state = await move(gameState.gameId, event.move, useAi);
    return updateGameState(state);
  };

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
export const handle = (handler: () => void) => (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  handler();
  return false;
};
