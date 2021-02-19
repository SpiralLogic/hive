export function handleDragOver (ev: { preventDefault: () => void }): boolean {
    ev.preventDefault();
    return false;
}

export function handleDrop (ev: { preventDefault: () => void }): boolean {
    ev.preventDefault();
    return false;
}

export const isEnterOrSpace = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

function focusNext (target: HTMLElement, direction: -1 | 1) {
    const allTabbable = Array.from(document.querySelectorAll('*[tabindex]:not(.name)'));
    const index = allTabbable.indexOf(target);
    (allTabbable[(index + direction) % allTabbable.length] as HTMLElement).focus();
}

export const handleKeyboardNav = (e: Pick<KeyboardEvent, 'key' | 'target'>): void => {
    if (e.target instanceof HTMLElement) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                focusNext(e.target, 1);
                return;
            case 'ArrowUp':
            case 'ArrowLeft':
                focusNext(e.target, -1);
                return;
        }
    }
};
