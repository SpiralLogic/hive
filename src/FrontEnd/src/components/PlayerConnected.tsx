import '../css/share.css';
import { FunctionComponent, Fragment } from 'preact';

type Props = { connected: 'connected' | 'disconnected' | false };
const PlayerConnected: FunctionComponent<Props> = (props) => {
  const { connected } = props;

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
