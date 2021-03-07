import { FunctionComponent, h, toChildArray } from 'preact';
import { Row } from '../domain/row';
import { VNode } from 'preact/debug/src/internal';

const Hextille: FunctionComponent<{ class?: string }> = (props) => {
  const childArray = toChildArray(props.children);

  const shiftClass = ((childArray[0] as VNode<Row>).key ?? childArray.length - 1) % 2 ? 'left' : 'right';
  return (
    <div role="grid" class={shiftClass}>
      {props.children}
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
