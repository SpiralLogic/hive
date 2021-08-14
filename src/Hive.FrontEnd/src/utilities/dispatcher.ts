import { useEffect } from 'preact/hooks';
import { HiveDispatcher, HiveEventListener, HiveIntent } from '../services';

const hiveDispatcher = new HiveDispatcher();

export const useHiveDispatcher = (): HiveDispatcher => hiveDispatcher;

export const useHiveDispatchListener = <T extends HiveIntent>(
  type: T['type'],
  listener: HiveEventListener<T>
): void => {
  const dispatcher = useHiveDispatcher();
  useEffect(() => {
    return dispatcher.add<T>(type, listener);
  });
};

export const dispatchHiveEvent = hiveDispatcher.dispatch;
