import { FunctionComponent, h } from 'preact';

const Modal: FunctionComponent<{ name: string; onClose: () => void }> = (props) => (
  <div class={`modal ${props.name}`}>
    {props.children}
    <button onClick={props.onClose}>Close</button>
  </div>
);

Modal.displayName = 'Modal';
export default Modal;
