import { FunctionComponent } from 'preact';

const SVG: FunctionComponent = (properties) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    {properties.children}
  </svg>
);

SVG.displayName = 'SVG';
export default SVG;
