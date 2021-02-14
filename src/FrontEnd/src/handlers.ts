export function handleDragOver(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export function handleDrop(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export const isEnterOrSpace = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

export const handleKeyboardNav = (e: Pick<KeyboardEvent, 'key' | 'target'>): boolean => {
  if (['ArrowDown', 'ArrowRight'].includes(e.key) && e.target) {
    const allTabbable = Array.from(document.querySelectorAll('*[tabindex]:not(.name)'));
    const index = allTabbable.indexOf(e.target as HTMLElement);
    (allTabbable[(index + 1) % allTabbable.length] as HTMLElement).focus();
    return true;
  }

  if (['ArrowUp', 'ArrowLeft'].includes(e.key) && e.target) {
    const allTabbable = Array.from(document.querySelectorAll('*[tabindex]:not(.name)'));
    const index = allTabbable.indexOf(e.target as HTMLElement);
    (allTabbable[(index + allTabbable.length - 1) % allTabbable.length] as HTMLElement).focus();
    return true;
  }
  
  return false;
};
