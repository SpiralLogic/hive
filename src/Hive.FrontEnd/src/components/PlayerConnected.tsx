import '../css/share.css';

import { Fragment, FunctionComponent, h } from 'preact';

type Properties = { connected: 'connected' | 'disconnected' | false };
const PlayerConnected: FunctionComponent<Properties> = (properties) => {
  const { connected } = properties;

  return (
    <Fragment>
      <p>Player has {connected}!</p>
      <button title="New Game" onClick={close}>
        Close
      </button>
    </Fragment>
  );
};
PlayerConnected.displayName = 'PlayerConnected';
export default PlayerConnected;
