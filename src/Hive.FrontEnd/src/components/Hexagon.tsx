import '../css/hexagon.css';

import { FunctionComponent, JSX } from 'preact';

import SVG from './SVG';
import { Signal } from '@preact/signals';

type Properties = {
  classes?: Signal<string>;
  hidden?: boolean;
  svg?: JSX.Element;
  canTabTo?: Signal<boolean>;
} & Partial<JSX.HTMLAttributes>;
const Hexagon: FunctionComponent<Properties> = (properties) => {
  const { canTabTo, classes, hidden, children, svg, ...attributes } = properties;

  if (hidden) attributes.role = 'none';
  if (classes?.peek().length) attributes.class = classes;
  if (canTabTo?.value) attributes.tabIndex = 0;

  return (
    <div {...attributes}>
      <SVG>
        <use href="#hex" />
        {svg}
      </SVG>
      {children}
    </div>
  );
};

Hexagon.displayName = 'Hexagon';
export default Hexagon;
