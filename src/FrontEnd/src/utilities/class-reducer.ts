import { useReducer } from 'preact/hooks';

const classReducer = (
  initialClasses: string,
  action: { type: 'add' | 'remove'; classes: string[] }
): string => {
  const classList = new Set(initialClasses.split(' '));
  switch (action.type) {
    case `add`:
      action.classes.forEach((c) => classList.add(c));
      break;
    case 'remove':
      action.classes.forEach((c) => classList.delete(c));
      break;
    default:
      break;
  }
  classList.delete('');
  return Array.from(classList).join(' ');
};

export const useClassReducer = (
  initialClasses: string
): [string, (action: { type: 'add' | 'remove'; classes: string[] }) => void] =>
  useReducer(classReducer, initialClasses);
