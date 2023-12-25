import '../css/hexagon.css';

import Svg, { SvgHrefs } from './Svg.tsx';
import { Signal } from '@preact/signals';
import { Creature } from '../domain';
import { ComponentChildren, JSX } from 'preact';
import { useTabindex } from '../hooks/useTabindex';

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
  const svgHrefs: SvgHrefs[] = ['hex'];
  const ref = useTabindex(attributes?.tabIndex);
  if (creature) svgHrefs.push(creature);
  if (hidden) attributes.role = 'none';

  return (
    <div class={classes} ref={ref} {...attributes}>
      <Svg hrefs={svgHrefs} />
      {children}
    </div>
  );
};

Hexagon.displayName = 'Hexagon';
export default Hexagon;
