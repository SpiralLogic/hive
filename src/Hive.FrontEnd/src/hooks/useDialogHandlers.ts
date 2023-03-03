import {useCallback, useEffect, useRef} from "preact/hooks";
import {effect, Signal} from "@preact/signals";

export const useDialogHandlers = (open: Signal<boolean>, onClose: () => void) => {
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

    const closeHandler = useCallback(() => {
        reference.current?.close();
    }, []);

    return [reference, closeHandler] as const;
}