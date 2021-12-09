import '../css/modal.css';

import { FunctionComponent } from 'preact';

type Properties = { visible: boolean; name: string; onClose: () => void };
const Modal: FunctionComponent<Properties> = (properties) => {
  const { visible, onClose, children } = properties;
  return visible ? (
    <div
      data-testid={'modal'}
      class="modal"
      onClick={(error) => (error.target as HTMLDivElement).classList.contains('modal') && onClose()}>
      <div role="dialog" title={properties.name} class={properties.name}>
        <button class="close" title="Close" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

Modal.displayName = 'Modal';
export default Modal;
