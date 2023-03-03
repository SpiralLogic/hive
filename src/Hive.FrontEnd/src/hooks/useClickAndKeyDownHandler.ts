import {useMemo} from "preact/hooks";
import {handleKeyboardNav, isEnterOrSpace} from "../utilities/handlers";

export const useClickAndKeyDownHandler = (callback: (event: UIEvent & { currentTarget: HTMLElement }) => void) => {
    return useMemo(() => ({
        handleClick: callback,
        handleKeyDown: (event: KeyboardEvent & { currentTarget: HTMLElement }) => {
            if (handleKeyboardNav(event) || !isEnterOrSpace(event)) return;
            callback(event);
        }
    }), []);
}