import { FunctionComponent, h } from 'preact';

const Cell: FunctionComponent<{ hidden?: boolean; [rest: string]: unknown }> = (props) => {
  const { hidden, children, ...rest } = props;

  return (
    <div role={hidden ? 'none' : 'cell'} {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <use href="#hex" />
      </svg>
      {children}
    </div>
  );
};

Cell.displayName = 'Cell';
export default Cell;
