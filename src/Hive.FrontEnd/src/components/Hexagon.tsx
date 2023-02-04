import '../css/hexagon.css';

import { FunctionComponent, JSX } from 'preact';

import SVG from './SVG';
import { effect, Signal } from '@preact/signals';
import { useRef } from 'preact/hooks';

type Properties = {
  classes?: Signal<string>;
  hidden?: boolean;
  svgs?: JSX.Element;
  canTabTo?: Signal<boolean>;
} & Partial<JSX.HTMLAttributes>;
const Hexagon: FunctionComponent<Properties> = (properties) => {
  const element = useRef<HTMLDivElement>(null);
  const { canTabTo, classes, hidden, children, svgs, ...attributes } = properties;

  if (hidden) attributes.role = 'none';

  effect(() => {
    if (element.current && classes && classes.value.length > 0) element.current.className = classes.value;
    if (element.current)
      if (canTabTo && canTabTo.value) {
        element.current.setAttribute('tabindex', '0');
      } else {
        element.current.removeAttribute('tabindex');
      }
  });

  if (classes?.peek().length) attributes.class = classes;
  if (canTabTo?.value) attributes.tabIndex = 0;

  return (
    <div ref={element} {...attributes}>
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
