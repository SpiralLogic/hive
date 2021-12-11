import '../css/share.css';

import { Fragment, FunctionComponent } from 'preact';

type Properties = { connected: 'connected' | 'disconnected' | false };
const PlayerConnected: FunctionComponent<Properties> = (properties) => {
  const { connected } = properties;

  return (
    <Fragment>
      <p>Player has {connected}!</p>
    </Fragment>
  );
};
PlayerConnected.displayName = 'PlayerConnected';
export default PlayerConnected;
