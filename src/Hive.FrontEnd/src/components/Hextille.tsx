import '../css/hextille.css';

import { FunctionComponent, toChildArray, VNode } from 'preact';

const Hextille: FunctionComponent<{ class?: string }> = (properties) => {
  const childArray = toChildArray(properties.children) as Array<VNode>;
  const shiftClass = (childArray[0].key ?? childArray.length) % 2 ? 'left' : 'right';

  return (
    <div role="grid" class={shiftClass}>
      {properties.children}
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
