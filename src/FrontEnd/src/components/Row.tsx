import { FunctionComponent, VNode, h, toChildArray } from 'preact';
const Row: FunctionComponent<{ class?: string; zIndex?: number }> = (props) => {

  return (
    <div class={props.class} role="row" style={props.zIndex ? { zIndex: props.zIndex } : undefined}>
      {props.children}
    </div>
  );
};

Row.displayName = 'Row';
export default Row;
