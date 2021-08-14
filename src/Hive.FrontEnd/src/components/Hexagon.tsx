import '../css/hexagon.css';

import {FunctionComponent, h, JSX } from 'preact';

import SVG from './SVG';

type Properties = { hidden?: boolean; svgs?: JSX.Element[] } & Partial<JSX.HTMLAttributes>;
const Hexagon: FunctionComponent<Properties> = (properties) => {
  const { hidden, children, svgs, ...attributes } = properties;
  if (hidden) attributes.role = 'none';
  return (
    <div {...attributes}>
      <SVG>
        <use href="#hex" />
        {svgs}
      </SVG>
      {children}
    </div>
  );
};

Hexagon.displayName = 'Cell';
export default Hexagon;
