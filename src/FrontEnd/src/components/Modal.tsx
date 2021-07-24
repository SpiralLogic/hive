import '../css/modal.css';
import { FunctionComponent } from 'preact';

type Props = { visible: boolean; name: string; onClose: () => void };
const Modal: FunctionComponent<Props> = (props) => {
  const { visible, onClose, children } = props;
  return visible ? (
    <div
      data-testid={'modal'}
      class="modal"
      onClick={(e) => (e.target as HTMLDivElement).classList.contains('modal') && onClose()}>
      <div role="dialog" title={props.name} class={props.name}>
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
