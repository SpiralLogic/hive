import '../css/hextille.css';

import { ComponentChildren, toChildArray } from 'preact';

const Hextille = ({children}: {  children: ComponentChildren }) => {
  const childArray = toChildArray(children) ;
  const shiftClass = ((typeof childArray[0] ==='object'  && childArray[0].key) ?? childArray.length) % 2 ? 'left' : 'right';

  return (
    <div role="grid" class={shiftClass}>
      {children}
    </div>
  );
};

Hextille.displayName = 'Hextille';
export default Hextille;
