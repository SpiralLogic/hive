import '../css/row.css';

import { ComponentChildren } from 'preact';

type Properties = { class?: string; zIndex?: number; hidden?: boolean; children: ComponentChildren };

const Row = (properties: Properties) => {
  const { hidden, zIndex, children } = properties;
  return (
    <div class={properties.class} role={hidden ? 'none' : 'row'} style={zIndex ? { zIndex } : undefined}>
      {children}
    </div>
  );
};

Row.displayName = 'Row';
export default Row;
