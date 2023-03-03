import {HiveDispatcher, HiveEventListener, HiveIntent} from '../services';
import {useContext, useEffect} from 'preact/hooks';
import {createContext} from 'preact';

export const dispatcher = new HiveDispatcher();
export const Dispatcher = createContext(dispatcher);
export const useDispatcher = () => useContext(Dispatcher);
export const useHiveDispatchListener = <T extends HiveIntent>(
    type: T['type'],
    listener: HiveEventListener<T>
): void => {
    const dispatcher = useDispatcher();
    useEffect(() => {
        return dispatcher.add<T>(type, listener);
    }, [type, listener]);
};
