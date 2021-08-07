import '../css/hextille.css';

import { FunctionComponent, toChildArray, VNode } from 'preact';

import { Row } from '../domain';

const Hextille: FunctionComponent<{ class?: string }> = (properties) => {
  const childArray = toChildArray(properties.children);
  const shiftClass = ((childArray[0] as VNode<Row>).key ?? childArray.length) % 2 ? 'left' : 'right';

  return (
    <div role="grid" class={shiftClass}>
      {properties.children}
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
