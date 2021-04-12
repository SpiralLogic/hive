import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import Modal from './Modal';

type Props = { connected: 'connected' | 'disconnected' | false };
const PlayerConnected: FunctionComponent<Props> = (props) => {
  const { connected } = props;

  return (
    <>
      <p>Player has {connected}!</p>
      <button title="New Game" onClick={close}>
        Close
      </button>
    </>
  );
};
PlayerConnected.displayName = 'PlayerConnected';
export default PlayerConnected;
