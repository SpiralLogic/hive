import { useEffect } from 'preact/hooks';
import { HiveDispatcher, HiveEventListener, HiveIntent } from '../services';

const hiveDispatcher = new HiveDispatcher();

export const useHiveDispatcher = (): HiveDispatcher => hiveDispatcher;

export const addHiveDispatchListener = <T extends HiveIntent>(
  type: T['type'],
  listener: HiveEventListener<T>
): void => {
  useEffect(() => {
    const dispatcher = useHiveDispatcher();
    return dispatcher.add<T>(type, listener);
  });
};

export const dispatchHiveEvent = hiveDispatcher.dispatch;
