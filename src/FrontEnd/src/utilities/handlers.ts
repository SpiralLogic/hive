import { OpponentSelectionHandler } from '../domain/engine';
import { useHiveDispatcher } from './hooks';

export function handleDragOver(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export function handleDrop(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export const isEnterOrSpace = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

function focusNext(target: HTMLElement, direction: -1 | 1) {
  const allTabbable = Array.from(document.querySelectorAll('*[tabindex]:not(.name)'));
  let index = allTabbable.indexOf(target);
  if (index + direction < 0) index = allTabbable.length;
  (allTabbable[(index + direction) % allTabbable.length] as HTMLElement).focus();
}

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
  const hiveDispatcher = useHiveDispatcher();
  if (type === 'select') {
    hiveDispatcher.dispatch({ type: 'tileSelect', tile });
  } else if (type === 'deselect') {
    hiveDispatcher.dispatch({ type: 'tileDeselect', tile });
  }
};
