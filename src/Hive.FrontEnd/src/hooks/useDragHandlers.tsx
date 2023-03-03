import {useMemo} from "preact/hooks";

export const useDragHandlers = (onDragStart: (event: DragEvent) => void, onDragEnd: (event: DragEvent) => void) => {
    return useMemo(() => ({
        handleDragStart: onDragStart,
        handleDragEnd: onDragEnd
    }), []);
}
export const useDragEnterLeaveHandlers = (onDragEnter: (event: DragEvent) => void, onDragLeave: (event: DragEvent) => void) => {
    return useMemo(() => ({
        handleDragEnter: onDragEnter,
        handleDragLeave: onDragLeave
    }), []);
}