import '../css/modal.css';

import {ComponentChildren} from 'preact';
import {Signal, useSignal} from '@preact/signals';
import {useDialogHandlers} from "../hooks/useDialogHandlers";
import {useMemo} from "preact/hooks";

type Properties = {
    open: Signal<boolean>;
    onClose: () => void;
    class?: string;
    children?: ComponentChildren;
    title: string;
};
export type CurrentDialog = 'none' | 'rules' | 'share' | 'playerConnected' | 'gameOver';
export const useModalActions = () => {
    const currentDialog = useSignal<CurrentDialog>('none');

    const handlers = useMemo(() => ({
            openDialog: (dialog: Exclude<CurrentDialog, 'none'>) => {
                if (dialog != 'gameOver') currentDialog.value = dialog;
            }, closeDialog: () => (currentDialog.value = 'none')
        }),
        []
    );
    return [currentDialog, handlers] as const;
}
const Modal = (properties: Properties) => {
    const {children, open, onClose, title} = properties;
    const [reference, closeHandler] = useDialogHandlers(open, onClose);

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
