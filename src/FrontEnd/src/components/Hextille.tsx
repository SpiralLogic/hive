import { FunctionComponent, h, toChildArray } from 'preact';
import { Row } from '../utilities/hextille-builder';
import { VNode } from 'preact/debug/src/internal';

const Hextille: FunctionComponent = ({ children }) => {
  const shiftClass = (toChildArray(children)[0] as VNode<Row>).key % 2 ? 'left' : 'right';
  return (
    <div className="hex-container">
      <main className={`hextille  ${shiftClass}`}>{children}</main>
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
