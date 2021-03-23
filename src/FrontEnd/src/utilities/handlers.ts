import { GameState, MoveTile, Tile } from '../domain';
import { MoveEvent, TileEvent } from '../services';
import { OpponentConnectedHandler, OpponentSelectionHandler } from '../domain/engine';
import { dispatchHiveEvent, useHiveDispatcher } from './hooks';

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
    }
  }
  return false;
};

export const opponentSelectionHandler: OpponentSelectionHandler = (type, tile) => {
  if (!tile) return;
  if (type === 'select') {
    dispatchHiveEvent({ type: 'tileSelect', tile });
  } else if (type === 'deselect') {
    dispatchHiveEvent({ type: 'tileDeselect', tile });
  }
};

export const opponentConnectedHandler: OpponentConnectedHandler = (type) => {
  if (type === 'connect') {
    dispatchHiveEvent({ type: 'opponentConnected' });
  } else if (type === 'disconnect') {
    dispatchHiveEvent({ type: 'opponentDisconnected' });
  }
};

export const attachServerHandlers = (
  sendSelection: (type: 'select' | 'deselect', tile: Tile) => void,
  gameState: GameState,
  updateGameState: (value: GameState) => void,
  moveTile: MoveTile
) => {
  const hiveDispatcher = useHiveDispatcher();

  const selectionChangeHandler = (event: TileEvent) => sendSelection('select', event.tile);
  const deselectionChangeHandler = (event: TileEvent) => sendSelection('deselect', event.tile);
  const moveHandler = async (event: MoveEvent) => {
    const gt = await moveTile(event.move);
    return updateGameState(gt);
  };

  hiveDispatcher.add<MoveEvent>('move', moveHandler);
  hiveDispatcher.add<TileEvent>('tileSelected', selectionChangeHandler);
  hiveDispatcher.add<TileEvent>('tileDeselected', deselectionChangeHandler);
  return () => {
    hiveDispatcher.remove<MoveEvent>('move', moveHandler);
    hiveDispatcher.remove<TileEvent>('tileSelected', selectionChangeHandler);
    hiveDispatcher.remove<TileEvent>('tileDeselected', deselectionChangeHandler);
  };
};
