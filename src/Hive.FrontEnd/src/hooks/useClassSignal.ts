import {useMemo} from 'preact/hooks';
import {useSignal} from '@preact/signals';

const getClassString = (classes: Set<string>) => [...classes].join(' ');
export const useClassSignal = (...initialClasses: string[]) => {
    const currentClasses = new Set<string>(initialClasses.map((c) => c.trim()));
    const classesSignal = useSignal(getClassString(currentClasses));
    const actions = useMemo(
        () => ({
            add: (...classes: string[]) => {
                for (const c of classes) currentClasses.add(c);
                classesSignal.value = [...currentClasses].join(' ');
      },
      remove: (...classes: string[]) => {
        for (const c of classes) currentClasses.delete(c);
        classesSignal.value = getClassString(currentClasses);
      },
    }),
    []
  );
  return [classesSignal, actions] as const;
};
