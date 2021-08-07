import { FunctionComponent } from 'preact';

const SVG: FunctionComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    {props.children}
  </svg>
);

SVG.displayName = 'SVG';
export default SVG;
