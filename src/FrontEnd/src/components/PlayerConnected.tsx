import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import Modal from './Modal';
type Props = {
  type: 'connected' | 'disconnected';
  setPlayerConnected: (value: 'connected' | 'disconnected' | undefined) => void;
};
const PlayerConnected: FunctionComponent<Props> = (props) => {
  const { type, setPlayerConnected } = props;
  return (
    <Modal name="player connected" onClose={() => setPlayerConnected(undefined)}>
      <p>Player has {type}!</p>
      <button title="New Game" onClick={() => setPlayerConnected(undefined)}>
        Close
      </button>
    </Modal>
  );
};
PlayerConnected.displayName = 'PlayerConnected';
export default PlayerConnected;
