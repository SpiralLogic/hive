import '../css/hexagon.css';

import { FunctionComponent, JSX } from 'preact';

import SVG from './SVG';
import { Signal } from '@preact/signals';

type Properties = {
  classes?: Signal<string>;
  hidden?: boolean;
  svg?: JSX.Element;
  tabIndex?: Signal<0 | undefined>;
} & Omit<Partial<JSX.HTMLAttributes>, 'tabIndex'>;
const Hexagon: FunctionComponent<Properties> = (properties) => {
  const { tabIndex, classes, hidden, children, svg, ...attributes } = properties;

  if (hidden) attributes.role = 'none';

  return (
    <div class={classes} tabIndex={tabIndex as Signal<number>} {...attributes}>
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
