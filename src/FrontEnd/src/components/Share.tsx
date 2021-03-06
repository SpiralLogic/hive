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
    console.error(e);
  }
  document.body.removeChild(textArea);
  return false;
};

const Share: FunctionComponent<Props> = (props) => {
  const id = window.location.href.split('/').pop()?.includes('1') ? 0 : 1;
  const opponentGame = {
    title: 'Hive board game',
    text: 'Share game to opponent!',
    url: `${window.location.href.slice(0, -1)}${id}`,
  };
  try {
    navigator.share(opponentGame).then();
    return null;
  } catch {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(opponentGame.url).then();
    } else {
      if (!fallbackCopyTextToClipboard(opponentGame.url)) return null;
    }
  }
  return (
    <Modal name="rules" onClose={() => props.setShowShare(false)}>
      Opponent link has been copied to clipboard!
    </Modal>
  );
};
Share.displayName = 'Share';
export default Share;
