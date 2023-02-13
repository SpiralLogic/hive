import '../css/hexagon.css';

import { FunctionComponent, JSX } from 'preact';

import SVG from './SVG';
import { Signal, useSignalEffect } from '@preact/signals';
import { useRef } from 'preact/hooks';

type Properties = Omit<Partial<JSX.HTMLAttributes>, 'tabIndex'> & {
  classes?: Signal<string>;
  hidden?: boolean;
  svg?: JSX.Element;
  tabIndex?: Signal<-1 | 0>;
};
const Hexagon: FunctionComponent<Properties> = (properties) => {
  const { classes, hidden, children, svg, ...attributes } = properties;
  const ref = useRef<HTMLDivElement>(null);
  if (hidden) attributes.role = 'none';
  useSignalEffect(() => {
    if (attributes.tabIndex?.value === 0) {
      ref.current?.setAttribute('tabindex', '0');
    } else {
      ref.current?.removeAttribute('tabindex');
    }
  });
  return (
    <div class={classes} ref={ref} {...attributes}>
      <SVG href="hex">{svg}</SVG>
      {children}
    </div>
  );
};

Hexagon.displayName = 'Hexagon';
export default Hexagon;
