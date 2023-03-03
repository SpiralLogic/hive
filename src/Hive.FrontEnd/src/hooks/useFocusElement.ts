import {useEffect} from "preact/hooks";
import {effect, useSignal} from "@preact/signals";

export const useFocusElement = (selector: string) => {
    const focus = useSignal(selector);
    useEffect(() => {
        return effect(() => {
            if (!focus.peek()) return;
            const focusElement = document.querySelector<HTMLElement>(focus.value);
            focusElement?.focus();
            focus.value = '';
        });
    }, [focus]);

    return focus;
}