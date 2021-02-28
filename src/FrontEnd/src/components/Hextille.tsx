import { FunctionComponent, h } from 'preact';

type Props = { shiftClass: 'left' | 'right' };

const Hextille: FunctionComponent<Props> = ({ shiftClass, children }) => {
  return (
    <div className="hex-container">
      <main className={`hextille  ${shiftClass}`}>{children}</main>
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
