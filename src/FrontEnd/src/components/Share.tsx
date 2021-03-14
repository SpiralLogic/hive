import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import Modal from './Modal';

type Props = { setShowShare: (value: boolean) => void };

const Share: FunctionComponent<Props> = (props) => {
  return (
    <Modal name="share" onClose={() => props.setShowShare(false)}>
      <p>Opponent's link has been copied to clipboard!</p>
      <button title="Close" onClick={() => props.setShowShare(false)}>
        Close
      </button>
    </Modal>
  );
};
Share.displayName = 'Share';
export default Share;
