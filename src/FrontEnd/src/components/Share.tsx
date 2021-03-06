import { FunctionComponent, h } from 'preact';
import Modal from './Modal';

type Props = { setShowShare: (value: boolean) => void };

const Share: FunctionComponent<Props> = (props) => {
  const id = window.location.href.substring(0, -1) === '1' ? 1 : 0;
  const opponentGame = {
    title: 'Hive board game',
    text: 'Share game to opponent!',
    url: `${window.location.href.slice(0, -1)}${id}`,
  };
  try {
    navigator.share(opponentGame).then();
    return null;
  } catch {
    navigator.clipboard.writeText(opponentGame.url).then();
  }
  return (
    <Modal name="rules" onClose={() => props.setShowShare(false)}>
      Opponent link has been copied to clipboard!
    </Modal>
  );
};

Share.displayName = 'Share';
export default Share;
