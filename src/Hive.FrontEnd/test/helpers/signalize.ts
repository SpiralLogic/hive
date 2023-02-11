import { Signal, signal } from '@preact/signals';

type Signalized<T extends Record<string, unknown>> = { [Property in keyof T]: Signal<T[Property]> };

export const signalize = <T extends Record<string, unknown>>(o: T) =>
  Object.entries(o).reduce<Signalized<T>>(
    (testGameState, [k, v]) => ({
      ...testGameState,
      [k]: signal(v),
    }),
    {} as Signalized<T>
  );
