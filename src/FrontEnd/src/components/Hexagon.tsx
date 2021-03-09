import '../css/hexagon.css'
import { FunctionComponent, JSX, h } from 'preact';
import SVG from './SVG';

type Props = { hidden?: boolean } & { svgs?: JSX.Element[] | undefined } & Partial<JSX.HTMLAttributes>;
const Hexagon: FunctionComponent<Props> = (props) => {
  const { hidden, children, svgs, ...attributes } = props;
  if (hidden) attributes.role = 'none';
  return (
    <div {...attributes}>
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
