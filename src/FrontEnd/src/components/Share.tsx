import { FunctionComponent, h } from 'preact';
import Modal from './Modal';

type Props = { setShowShare: (value: boolean) => void };

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
  const parts = window.location.href.split('/');
  parts.push(parts.pop() === '1' ? '0' : '1');
  const opponentGame = {
    title: 'Hive board game',
    text: 'Share game to opponent!',
    url: parts.join('/'),
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
      Opponent link has been copied to clipboard!
    </Modal>
  );
};
Share.displayName = 'Share';
export default Share;
