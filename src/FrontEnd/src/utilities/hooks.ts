import { HiveDispatcher, HiveEventListener, HiveIntent } from './hive-dispatcher';
import { useEffect, useReducer } from 'preact/hooks';

const hiveDispatcher = new HiveDispatcher();

export const useHiveDispatcher = (): HiveDispatcher => {
  return hiveDispatcher;
};

export const addHiveEventListener = <T extends HiveIntent>(
  type: T['type'],
  listener: HiveEventListener<T>
): void => {
  useEffect(() => {
    const emitter = useHiveDispatcher();
    return emitter.add<T>(type, listener);
  });
};

const classReducer = (initialClasses: string, action: { type: 'add' | 'remove'; class: string }): string => {
  const classList = new Set(initialClasses.split(' '));
  if (action.type === `add`) {
    classList.add(action.class);
  } else if (action.type === 'remove') {
    classList.delete(action.class);
  }
  return Array.from(classList).join(' ');
};

export const useClassReducer = (
  initialClasses: string
): [string, (action: { type: 'add' | 'remove'; class: string }) => void] =>
  useReducer(classReducer, initialClasses);
