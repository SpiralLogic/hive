import { useEffect } from 'preact/hooks';
import { HiveDispatcher, HiveEventListener, HiveIntent } from '../services';

const hiveDispatcher = new HiveDispatcher();

export const getHiveDispatcher = (): HiveDispatcher => hiveDispatcher;

export const useHiveDispatchListener = <T extends HiveIntent>(
  type: T['type'],
  listener: HiveEventListener<T>
): void => {
  useEffect(() => {
    const dispatcher = getHiveDispatcher();
    return dispatcher.add<T>(type, listener);
  });
};

export const dispatchHiveEvent = hiveDispatcher.dispatch;
