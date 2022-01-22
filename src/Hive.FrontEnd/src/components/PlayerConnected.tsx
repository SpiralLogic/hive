import '../css/share.css';

import { FunctionComponent } from 'preact';

type Properties = { connected: 'connected' | 'disconnected' | false };
const PlayerConnected: FunctionComponent<Properties> = (properties) => {
  const { connected } = properties;

  return (
    <>
      <p>Player has {connected}!</p>
    </>
  );
};
PlayerConnected.displayName = 'PlayerConnected';
export default PlayerConnected;
