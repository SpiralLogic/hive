import { fireEvent } from '@testing-library/preact';

export const simulateEvent = (target: HTMLElement, type: string): (() => void) => {
  const preventDefault = jest.fn();
  const event = new MouseEvent(type, { bubbles: true });
  Object.assign(event, { preventDefault });
  fireEvent(target, event);

  return preventDefault;
};
