import { HiveEvent, HiveEventEmitter, HiveEventListener } from './hive-event-emitter';
import { useEffect, useReducer } from 'preact/hooks';

const hiveEventEmitter = new HiveEventEmitter();

export const useHiveEventEmitter = (): HiveEventEmitter => {
  return hiveEventEmitter;
};

export const addHiveEventListener = <T extends HiveEvent>(
  type: T['type'],
  listener: HiveEventListener<T>
) => {
  useEffect(() => {
    const emitter = useHiveEventEmitter();
    emitter.add<T>(type, listener);
    return () => emitter.remove<T>(type, listener);
  });
};

const classReducer = (
  initialClasses: Array<string>,
  action: { type: 'add' | 'remove'; classes: string[] }
): string[] => {
  const { type, classes } = action;
  switch (type) {
    case 'add':
      return [...initialClasses, ...classes.filter((c) => !initialClasses.includes(c))];
    case 'remove':
      return initialClasses.filter((c) => !classes.includes(c));
  }
};

export const useClassReducer = (
  initialClasses: string[]
): [Array<string>, (action: { type: 'add' | 'remove'; classes: string[] }) => void] =>
  useReducer(classReducer, initialClasses);
