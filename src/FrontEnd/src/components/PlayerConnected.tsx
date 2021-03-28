import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import Modal from './Modal';

type Props = { connected: 'connected' | 'disconnected'; close: VoidFunction };
const PlayerConnected: FunctionComponent<Props> = (props) => {
  const { connected, close } = props;

  return (
    <Modal name="player connected" onClose={close}>
      <p>Player has {connected}!</p>
      <button title="New Game" onClick={close}>
        Close
      </button>
    </Modal>
  );
};
PlayerConnected.displayName = 'PlayerConnected';
export default PlayerConnected;
