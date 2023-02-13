import { FunctionComponent } from 'preact';

type Properties = {
  href:
    | 'ant'
    | 'beetle'
    | 'grasshopper'
    | 'spider'
    | 'queen'
    | 'hex'
    | 'github'
    | 'share'
    | 'arrow'
    | 'new'
    | 'ai'
    | 'rules'
    | undefined;
};
const SVG: FunctionComponent<Properties> = ({ href, children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    {!!href && <use href={`#${href}`} />}
    {children}
  </svg>
);

SVG.displayName = 'SVG';
export default SVG;
