import '../css/modal.css';

import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

type Properties = {
  isOpen?: boolean;
  name: string;
  onClose?: () => void;
};

const Modal: FunctionComponent<Properties> = (properties) => {
  const { children, isOpen = false, name, onClose = () => {} } = properties;
  const reference = useRef<HTMLDialogElement>(null);

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    const referenceOpen = reference.current?.hasAttribute('open');

    if (referenceOpen !== isOpen) {
      isOpen ? reference.current?.showModal() : reference.current?.close();
      setOpen(isOpen);
    }
  }, [isOpen, open]);

  const closeHandler = (event: MouseEvent) => {
    event.preventDefault();
    reference.current?.close();
    onClose();
  };

  return (
    <dialog open={open || undefined} ref={reference} aria-details={name} class={name}>
      <button class="close" aria-label="Close Dialog" onClick={closeHandler}>
        X
      </button>
      {children}
    </dialog>
  );
};

Modal.displayName = 'Modal';
export default Modal;
