/* eslint-disable func-names,@typescript-eslint/no-unnecessary-condition,@typescript-eslint/unbound-method */
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/preact';
import 'preact';

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
  serialize: ({ container }: ReturnType<typeof render>, config, indentation, depth, references, printer) =>
    // eslint-disable-next-line testing-library/no-node-access,@typescript-eslint/no-unsafe-member-access
    printer(container.firstElementChild, config, indentation, depth, references),
});
