import { HiveEvent, HiveEventEmitter, HiveEventListener } from './hive-event-emitter';
import { Inputs, useEffect, useReducer } from 'preact/hooks';

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
