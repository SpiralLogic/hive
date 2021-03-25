import { useReducer } from 'preact/hooks';

const classReducer = (
  initialClasses: string,
  action: { type: 'add' | 'remove'; classes: string[] }
): string => {
  const classList = new Set(initialClasses.split(' '));
  if (action.type === `add`) {
    action.classes.forEach((c) => classList.add(c));
  } else if (action.type === 'remove') {
    action.classes.forEach((c) => classList.delete(c));
  }
  classList.delete('');
  return Array.from(classList).join(' ');
};

export const useClassReducer = (
  initialClasses: string
): [string, (action: { type: 'add' | 'remove'; classes: string[] }) => void] =>
  useReducer(classReducer, initialClasses);
