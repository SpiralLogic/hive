import { HiveEvent, HiveEventEmitter, HiveEventListener } from './emitters';
import { Inputs, useEffect, useLayoutEffect } from 'preact/hooks';

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

export const useFocusEffect = (tabIndexes: number[], inputs?: Inputs): void => {
  useLayoutEffect(() => {
    const selector = tabIndexes.map((t) => `[tabIndex="${t}"]`).join(',');
    Array.from(document.querySelectorAll<HTMLElement>(selector))
      .sort((e1, e2) => e1.tabIndex - e2.tabIndex)
      .shift()
      ?.focus();
  }, inputs);
};
