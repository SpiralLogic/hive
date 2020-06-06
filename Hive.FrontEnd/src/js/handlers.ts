export function handleDragOver(ev: { preventDefault: () => void }): boolean {
    ev.preventDefault();
    return false;
}

export function handleDrop(ev: { preventDefault: () => void }): boolean {
    ev.preventDefault();
    return false;
}
