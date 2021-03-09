import '../css/modal.css'
import { FunctionComponent, h } from 'preact';

const Modal: FunctionComponent<{ name: string; onClose: () => void }> = (props) => (
  <div class="modal">
    <div role="dialog" title={props.name} class={`${props.name}`}>
      {props.children}
      <button title="Close" onClick={props.onClose}>
        Close
      </button>
    </div>
  </div>
);

Modal.displayName = 'Modal';
export default Modal;
