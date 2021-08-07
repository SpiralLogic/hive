import '../css/row.css';

import { FunctionComponent } from 'preact';

type Props = { class?: string; zIndex?: number; hidden?: boolean };

const Row: FunctionComponent<Props> = (props) => {
  const { hidden, zIndex } = props;
  return (
    <div class={props.class} role={hidden ? 'none' : 'row'} style={zIndex ? { zIndex } : undefined}>
      {props.children}
    </div>
  );
};

Row.displayName = 'Row';
export default Row;
