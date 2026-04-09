import { useCallback, useEffect, useRef } from 'preact/hooks';
import { effect, Signal } from '@preact/signals';

export const useDialogHandlers = (open: Signal<boolean>, onClose: () => void) => {
  const reference = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogNode = reference.current;
    if (dialogNode) {
      dialogNode.addEventListener('close', onClose);
    }

    const dispose = effect(() => {
      if (!open.value) return;
      if (!dialogNode?.open) dialogNode?.showModal();
    });

    return () => {
      dialogNode?.removeEventListener('close', onClose);
      dispose();
    };
  }, [open, onClose]);

  const closeHandler = useCallback(() => {
    reference.current?.close();
  }, []);

  return [reference, closeHandler] as const;
};
