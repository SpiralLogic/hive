import { FunctionComponent, h } from 'preact';

const Row: FunctionComponent = (props) => {
  return <div className="hex-row">{props.children}</div>;
};

Row.displayName = 'Row';
export default Row;
