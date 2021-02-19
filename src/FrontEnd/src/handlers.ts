export function handleDragOver (ev: { preventDefault: () => void }): boolean {
    ev.preventDefault();
    return false;
}

export function handleDrop (ev: { preventDefault: () => void }): boolean {
    ev.preventDefault();
    return false;
}

export const isEnterOrSpace = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

export const handleKeyboardNav = (e: Pick<KeyboardEvent, 'key' | 'target'>): boolean => {
    if (!e.target) return false;
    if ('ArrowDown' === e.key || 'ArrowRight' === e.key) {
        const allTabbable = Array.from(document.querySelectorAll('*[tabindex]:not(.name)'));
        const index = allTabbable.indexOf(e.target as HTMLElement);
        (allTabbable[(index + 1) % allTabbable.length] as HTMLElement).focus();
        return true;
    }

    if ('ArrowUp' === e.key || 'ArrowLeft' === e.key) {
        const allTabbable = Array.from(document.querySelectorAll('*[tabindex]:not(.name)'));
        const index = allTabbable.indexOf(e.target as HTMLElement);
        (allTabbable[(index + allTabbable.length - 1) % allTabbable.length] as HTMLElement).focus();
        return true;
    }
    return false;
};
