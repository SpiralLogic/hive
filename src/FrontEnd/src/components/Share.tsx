import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import Modal from './Modal';

type Props = { url: string; setShowShare: (value: boolean) => void };

const fallbackCopyTextToClipboard = (text: string) => {
  const currentFocus = document.activeElement as HTMLElement;
  const textArea = document.createElement('textarea');
  textArea.value = text;

  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    if (currentFocus && currentFocus.focus) currentFocus.focus();
    return true;
  } catch (e) {
    //  if (process.env.NODE_ENV !== 'production') console.error(e);
  } finally {
    document.body.removeChild(textArea);
  }
  return false;
};

const Share: FunctionComponent<Props> = (props) => {
  const opponentGame = {
    title: 'Hive board game',
    text: 'Join me in a game of the Hive!',
    url: props.url,
  };
  try {
    navigator.share(opponentGame).then();
    return null;
  } catch {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(opponentGame.url).then();
    } else {
      if (!fallbackCopyTextToClipboard(opponentGame.url)) return null;
    }
  }
  return (
    <Modal name="share" onClose={() => props.setShowShare(false)}>
      <p>Opponent's link has been copied to clipboard!</p>
      <button title="Close" onClick={() => props.setShowShare(false)}>
        Close
      </button>{' '}
    </Modal>
  );
};
Share.displayName = 'Share';
export default Share;
