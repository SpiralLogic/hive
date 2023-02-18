import { FunctionComponent } from 'preact';
import { Creature } from '../domain';

export type Svg = Creature | 'hex' | 'github' | 'share' | 'arrow' | 'new' | 'ai' | 'rules';

type Properties = {
  hrefs: Svg | Svg[];
};

const SVG: FunctionComponent<Properties> = ({ hrefs }) => {
  if (!Array.isArray(hrefs)) hrefs = [hrefs];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      {hrefs.map((href) => (
        <use href={`#${href.toLowerCase()}`} />
      ))}
    </svg>
  );
};

SVG.displayName = 'SVG';
export default SVG;
