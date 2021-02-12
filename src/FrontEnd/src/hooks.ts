import { HiveEvent, HiveEventEmitter, HiveEventListener } from './hive-event-emitter';
import { Inputs, useEffect } from 'preact/hooks';

const hiveEventEmitter = new HiveEventEmitter();

export const useHiveEventEmitter = (
  hiveEventHandler?: HiveEventListener<HiveEvent>,
  inputs?: Inputs
): HiveEventEmitter => {
  if (hiveEventHandler)
    useEffect(() => {
      hiveEventEmitter.add(hiveEventHandler);
      return () => {
        hiveEventEmitter.remove(hiveEventHandler);
      };
    }, inputs);

  return hiveEventEmitter;
};
