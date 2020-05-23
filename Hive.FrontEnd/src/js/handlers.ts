import * as React from 'react';

export function handleDragOver(e: React.DragEvent<HTMLDivElement>): boolean {
    e.preventDefault();
    return false;
}

export function handleDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    return false;
}
