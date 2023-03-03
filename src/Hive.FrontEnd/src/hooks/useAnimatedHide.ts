import {useEffect} from "preact/hooks";
import {useClassSignal} from "./useClassSignal";

export const useAnimatedHide = (shouldHide: boolean, [classes, classAction]: ReturnType<typeof useClassSignal>) => {
    useEffect(() => {
        if (shouldHide) {
            setTimeout(() => classAction.add('hide'), 100);
        }
    }, [shouldHide, classAction]);

    const ontransitionend = () => {
        if (classes.peek().includes('hide')) classAction.add('hidden');
    };

    return {onTransitionEnd: ontransitionend, onAnimationEnd: ontransitionend} as const;
}
export const useHide = (shouldHide: boolean, [, classActions]: ReturnType<typeof useClassSignal>) => {
    useEffect(() => (shouldHide ? classActions.add('hide') : classActions.remove('hide')), [shouldHide, classActions]);

}