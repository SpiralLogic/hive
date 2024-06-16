import { Signal, signal } from '@preact/signals';

type Signalized<T extends Record<string, unknown>> = { [Property in keyof T]: Signal<T[Property]> };

export const signalize = <T extends Record<string, unknown>>(o: T): Signalized<T> => {
  const testGameState = {} as Signalized<T>;
  for (const key in o) {
    testGameState[key] = signal(o[key]);
  }
  return testGameState;
};
