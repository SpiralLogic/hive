import { FunctionComponent, h } from 'preact';
import { useClassReducer } from '../utilities/hooks';

const Modal: FunctionComponent<{ name: string; onClose: () => void }> = (props) => {
  const [classes, setClasses] = useClassReducer(`modal ${props.name}`);

  return (
    <div class={classes}>
      {props.children}
      <button onClick={props.onClose}>Close</button>
    </div>
  );
};

Modal.displayName = 'Modal';
export default Modal;
