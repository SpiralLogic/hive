import { HiveDispatcher, HiveEventListener, HiveIntent } from './hive-dispatcher';
import { useEffect, useReducer } from 'preact/hooks';

const hiveDispatcher = new HiveDispatcher();

export const useHiveDispatcher = (): HiveDispatcher => {
  return hiveDispatcher;
};

export const addHiveDispatchListener = <T extends HiveIntent>(
  type: T['type'],
  listener: HiveEventListener<T>
): void => {
  useEffect(() => {
    const emitter = useHiveDispatcher();
    return emitter.add<T>(type, listener);
  });
};

export const dispatchHiveEvent = hiveDispatcher.dispatch;

const classReducer = (
  initialClasses: string,
  action: { type: 'add' | 'remove'; classes: string[] }
): string => {
  const classList = new Set(initialClasses.split(' '));
  if (action.type === `add`) {
    action.classes.forEach((c) => classList.add(c));
  } else if (action.type === 'remove') {
    action.classes.forEach((c) => classList.delete(c));
  }
  classList.delete('');
  return Array.from(classList).join(' ');
};

export const useClassReducer = (
  initialClasses: string
): [string, (action: { type: 'add' | 'remove'; classes: string[] }) => void] =>
  useReducer(classReducer, initialClasses);
