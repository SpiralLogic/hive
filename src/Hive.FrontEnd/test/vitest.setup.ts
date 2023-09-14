import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';

/** polyfill for JSON missing HTMLDialogElement for now */
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  if (this.hasAttribute('open')) return;
  this.setAttribute('open', 'true');
};

HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  if (!this.hasAttribute('open')) return;
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close', { bubbles: false, cancelable: false }));
};

expect.addSnapshotSerializer({
  test: ({ asFragment, container, rerender }) =>
    typeof rerender === 'function' && typeof asFragment === 'function' && container,
  serialize: ({ container }, config, indentation, depth, references, printer) =>
    printer(container.firstElementChild, config, indentation, depth, references),
});
