import {useEffect} from "preact/hooks";
import {useClassSignal} from "./useClassSignal";

export const useAnimatedHide = (initialClasses:string, shouldHide: boolean) => {
    const [classes, action] = useClassSignal(initialClasses);
    useEffect(() => {
        if (shouldHide) {
            setTimeout(() => action.add('hide'), 100);
        }
    }, [shouldHide, action]);

    const ontransitionend = () => {
        if (classes.peek().includes('hide')) action.add('hidden');
    };

    return {class:classes, onTransitionEnd: ontransitionend, onAnimationEnd: ontransitionend} as const;
}
export const useHide = (shouldHide: boolean, [, action]: ReturnType<typeof useClassSignal>) => {
    useEffect(() => (shouldHide ? action.add('hide') : action.remove('hide')), [shouldHide, action]);

}