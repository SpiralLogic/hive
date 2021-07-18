import { PlayerId } from '../domain';

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
  let copied = false;
  try {
    document.execCommand('copy');
    currentFocus.focus();
    copied = true;
  } catch {
    copied = false;
  }
  document.body.removeChild(textArea);
  return copied;
};

export const getShareUrl = (currentPlayer: PlayerId) => {
  const parts = window.location.href.split('/');
  parts[parts.length - 1] = currentPlayer === 1 ? '0' : '1';
  return parts.join('/');
};

export const shareGame = (currentPlayer: PlayerId) => {
  const url = getShareUrl(currentPlayer);
  const opponentGame = {
    title: 'Hive board game',
    text: 'Click this link to join me in a game of the Hive!',
    url,
  };
  try {
    navigator.share(opponentGame).catch(() => {});
    return false;
  } catch {
    try {
      navigator.clipboard.writeText(opponentGame.url).catch(() => {});
      return true;
    } catch {
      return fallbackCopyTextToClipboard(opponentGame.url);
    }
  }
};
