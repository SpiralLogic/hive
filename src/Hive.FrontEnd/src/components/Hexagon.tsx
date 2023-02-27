import '../css/hexagon.css';

import SVG from './SVG';
import { Signal, useSignalEffect } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { Creature } from '../domain';
import { ComponentChildren, JSX } from 'preact';

type Properties = {
  classes?: Signal<string>;
  hidden?: boolean;
  tabIndex?: Signal<-1 | 0>;
  creature?: Creature;
  children?: ComponentChildren;
  role?: JSX.IntrinsicElements['div']['role'];
  style?: JSX.IntrinsicElements['div']['style'];
};
const Hexagon = (properties: Properties) => {
  const { creature, classes, hidden, children, ...attributes } = properties;
  const ref = useRef<HTMLDivElement>(null);
  const svgHrefs = ['hex'];

  if (creature) svgHrefs.push(creature);
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
      <SVG hrefs={svgHrefs} />
      {children}
    </div>
  );
};

Hexagon.displayName = 'Hexagon';
export default Hexagon;
