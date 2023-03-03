import {useRef} from "preact/hooks";
import {Signal, useSignalEffect} from "@preact/signals";

export const useTabindex = (tabIndex: Signal<number> | undefined) => {
    const ref = useRef<HTMLDivElement>(null);
    useSignalEffect(() => {
        if (tabIndex?.value === 0) {
            ref.current?.setAttribute('tabindex', '0');
        } else {
            ref.current?.removeAttribute('tabindex');
        }
    });

    return ref
}