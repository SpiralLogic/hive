import { FunctionComponent, h } from 'preact';

const Cell: FunctionComponent<{ hidden?: boolean; classes?: string; [rest: string]: unknown }> = (props) => {
  const { hidden, classes, children, ...rest } = props;

  return (
    <div class={'hex cell ' + classes} {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <use href="#hex" />
      </svg>
      {children}
    </div>
  );
};

Cell.displayName = 'Cell';
export default Cell;
