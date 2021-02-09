export function handleDragOver(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export function handleDrop(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export function handleKeyboardClick(event: KeyboardEvent): boolean {
  const clickEvent = new MouseEvent('click');
  if ((event.key === 'Enter' || event.key === ' ') && event.target?.dispatchEvent) {
    return event.target.dispatchEvent(clickEvent);
  }

  return true;
}
