import {MockedFunction, vi} from 'vitest';

export const mockClipboard = () => {
    const clipboard = navigator.clipboard;
    const writeText = vi.fn() as MockedFunction<() => Promise<void>>;
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: writeText.mockResolvedValue(),
        },
        configurable: true,
        writable: true,
    });
    return [ () => {
        Object.defineProperty(navigator, 'clipboard', {value: clipboard})
    },writeText]
};

export const mockExecCommand = () => {
    const value = vi.fn() as MockedFunction<() => Promise<void>>;
    Object.defineProperty(document, 'execCommand', {
        value,
        configurable: true,
        writable: true,
    });

    return [() => {
        Object.defineProperty(document, 'execCommand', {value: undefined});
    },value];
};

export const mockShare = () => {
    const share = navigator.share;
    const value = vi.fn() as MockedFunction<() => Promise<void>>;
    Object.defineProperty(navigator, 'share', {
        value,
        configurable: true,
        writable: true,
    });
    return [() => {
        Object.defineProperty(navigator, 'share', {value: share});
    },value];
};

export const noShare = () => {
    const share = navigator.share;
    Object.defineProperty(navigator, 'share', {value: undefined});
    return [(): void => {
        Object.defineProperty(navigator, 'share', {value: share});
    }]
};
