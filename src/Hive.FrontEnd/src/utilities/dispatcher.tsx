import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { HiveDispatcher, HiveEventListener, HiveIntent } from '../services';

export const Dispatcher = createContext(new HiveDispatcher());

export const useHiveDispatchListener = <T extends HiveIntent>(
  type: T['type'],
  listener: HiveEventListener<T>
): void => {
  const dispatcher = useContext(Dispatcher);
  useEffect(() => {
    return dispatcher.add<T>(type, listener);
  });
};