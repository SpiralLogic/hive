import {  useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';

const getClassString = (classList: Set<string>) => Array.from(classList).join(' ');
export const useClassSignal = (...initialClasses: string[]) => {
  const classList = new Set<string>(initialClasses.map((c) => c.trim()));
  const classSignal = useSignal(getClassString(classList));
  const classActions = useMemo(
    () => ({
      add: (...classes: string[]) => {
        classes.forEach((c) => classList.add(c));
        classSignal.value = Array.from(classList).join(' ');
      },
      remove: (...classes: string[]) => {
        classes.forEach((c) => classList.delete(c));
        classSignal.value = getClassString(classList);
      },
    }),
    []
  );
  return [classSignal, classActions] as const;
};
