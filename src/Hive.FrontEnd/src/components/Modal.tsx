import '../css/modal.css';

import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

type Properties = {
  open: boolean;
  onClose: () => void;
  class?: string;
  title: string;
};

const Modal: FunctionComponent<Properties> = (properties) => {
  const { children, open, onClose, title } = properties;
  const reference = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialogNode = reference.current;
    if (!dialogNode?.open) dialogNode?.showModal();

    dialogNode?.addEventListener('close', onClose);

    return () => dialogNode?.removeEventListener('close', onClose);
  }, [open, onClose]);

  const closeHandler = () => {
    reference.current?.close();
  };

  return (
    <dialog ref={reference} aria-label={title} class={properties.class}>
      <button class="close" aria-label="Close Dialog" onClick={closeHandler}>
        X
      </button>
      {children}
    </dialog>
  );
};

Modal.displayName = 'Modal';
export default Modal;
