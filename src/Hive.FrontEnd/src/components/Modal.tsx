import '../css/modal.css';

import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

type Properties = {
  isOpen: boolean;
  onClose: () => void;
  class?: string;
  title: string;
};

const Modal: FunctionComponent<Properties> = (properties) => {
  const { children, isOpen, onClose, title } = properties;
  const reference = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialogNode = reference.current;
    dialogNode?.showModal();
    dialogNode?.addEventListener('close', onClose);

    return () => dialogNode?.removeEventListener('close', onClose);
  }, [isOpen, onClose]);

  const closeHandler = () => {
    reference.current?.close();
  };

  return isOpen ? (
    <dialog ref={reference} aria-label={title} class={properties.class}>
      <button class="close" aria-label="Close Dialog" onClick={closeHandler}>
        X
      </button>
      {children}
    </dialog>
  ) : null;
};

Modal.displayName = 'Modal';
export default Modal;
