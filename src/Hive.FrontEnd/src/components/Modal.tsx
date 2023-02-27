import '../css/modal.css';

import { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { effect, Signal } from '@preact/signals';

type Properties = {
  open: Signal<boolean>;
  onClose: () => void;
  class?: string;
  children?: ComponentChildren;
  title: string;
};

const Modal = (properties: Properties) => {
  const { children, open, onClose, title } = properties;
  const reference = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dispose = effect(() => {
      const dialogNode = reference.current;
      if (!open.value) return;
      if (!dialogNode?.open) dialogNode?.showModal();
      dialogNode?.addEventListener('close', onClose);
    });

    return () => {
      reference.current?.removeEventListener('close', onClose);
      dispose();
    };
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
