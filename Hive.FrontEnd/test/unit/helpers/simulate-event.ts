import { fireEvent } from '@testing-library/preact';

export const simulateEvent = function (target: HTMLElement, type: string) {
    const preventDefault = jest.fn();
    const e = new MouseEvent(type, { bubbles: true });
    Object.assign(e, { preventDefault });
    fireEvent(target, e);

    return preventDefault;
};
