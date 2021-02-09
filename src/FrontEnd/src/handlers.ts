export function handleDragOver(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export function handleDrop(ev: { preventDefault: () => void }): boolean {
  ev.preventDefault();
  return false;
}

export function handleKeyboardClick(e: KeyboardEvent): boolean {
  const clickEvent = new MouseEvent('click');
  return (e.key === 'Enter' || e.key === ' ') && (e.target?.dispatchEvent(clickEvent) ?? false);
}
