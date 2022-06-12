import { useReducer } from 'preact/hooks';

const classReducer = (
  initialClasses: string,
  action: { type: 'add' | 'remove'; classes: Array<string> }
): string => {
  const classList = new Set(initialClasses.split(' '));
  if (action.type === `add`) {
    for (const c of action.classes) classList.add(c);
  } else {
    for (const c of action.classes) classList.delete(c);
  }
  classList.delete('');
  return [...classList].join(' ');
};

export const useClassReducer = (
  initialClasses: string
): [string, (action: { type: 'add' | 'remove'; classes: Array<string> }) => void] =>
  useReducer(classReducer, initialClasses);
