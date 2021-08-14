import '../css/row.css';

import { FunctionComponent, h } from 'preact';

type Properties = { class?: string; zIndex?: number; hidden?: boolean };

const Row: FunctionComponent<Properties> = (properties) => {
  const { hidden, zIndex, children } = properties;
  return (
    <div class={properties.class} role={hidden ? 'none' : 'row'} style={zIndex ? { zIndex } : undefined}>
      {children}
    </div>
  );
};

Row.displayName = 'Row';
export default Row;
