import { Creature } from '../domain';
import { JSX } from 'preact';

export type SvgHrefs = Creature | ('hex' | 'github' | 'share' | 'arrow' | 'new' | 'ai' | 'rules');

type Properties = {
  hrefs: SvgHrefs[];
} & JSX.IntrinsicElements['svg'];

const Svg = ({ hrefs, ...rest }: Properties) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...rest}>
      {hrefs.map((href) => (
        <use key={`${href}`} href={`#${href.toLowerCase()}`} />
      ))}
    </svg>
  );
};

Svg.displayName = 'SVG';
export default Svg;
