import { fireEvent } from '@testing-library/preact';
import { vi } from 'vitest';

export const simulateEvent = (target: HTMLElement, type: string): (() => void) => {
  const preventDefault = vi.fn();
  const event = new MouseEvent(type, { bubbles: true });
  Object.assign(event, { preventDefault });
  fireEvent(target, event);

  return preventDefault;
};
