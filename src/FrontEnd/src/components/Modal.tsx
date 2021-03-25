import '../css/modal.css';
import { FunctionComponent, h } from 'preact';

const Modal: FunctionComponent<{ name: string; onClose: () => void }> = (props) => (
  <div
    class="modal"
    onClick={(e) => (e.target as HTMLDivElement).classList?.contains('modal') && props.onClose()}>
    <div role="dialog" title={props.name} class={props.name}>
      {props.children}
    </div>
  </div>
);

Modal.displayName = 'Modal';
export default Modal;
