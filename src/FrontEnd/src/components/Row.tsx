import { FunctionComponent, h } from 'preact';
import { deepEqual } from 'fast-equals';
import { memo } from 'preact/compat';

const Row: FunctionComponent = (props) => {
  return <div className="hex-row">{props.children}</div>;
};

Row.displayName = 'Row';
export default memo(Row, deepEqual);
