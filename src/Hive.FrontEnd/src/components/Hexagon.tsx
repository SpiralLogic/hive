import '../css/hexagon.css';

import { FunctionComponent, JSX } from 'preact';

import SVG from './SVG';
import { Signal, useSignalEffect } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { Creature } from '../domain';

type Properties = Omit<JSX.HTMLAttributes, 'tabIndex'> & {
  classes?: Signal<string>;
  hidden?: boolean;
  tabIndex?: Signal<-1 | 0>;
  svgs?: Creature[];
};
const Hexagon: FunctionComponent<Properties> = (properties) => {
  const { svgs = [], classes, hidden, children, ...attributes } = properties;
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
      <SVG hrefs={['hex', ...svgs]} />
      {children}
    </div>
  );
};

Hexagon.displayName = 'Hexagon';
export default Hexagon;
