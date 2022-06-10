import { useReducer } from 'preact/hooks';

const classReducer = (
  initialClasses: string,
  action: { type: 'add' | 'remove'; classes: Array<string> }
): string => {
  const classList = new Set(initialClasses.split(' '));
  switch (action.type) {
    case `add`:
      for (const c of action.classes) classList.add(c);
      break;
    default:
      for (const c of action.classes) classList.delete(c);
      break;
  }
  classList.delete('');
  return [...classList].join(' ');
};

export const useClassReducer = (
  initialClasses: string
): [string, (action: { type: 'add' | 'remove'; classes: Array<string> }) => void] =>
  useReducer(classReducer, initialClasses);
