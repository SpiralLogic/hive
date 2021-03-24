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
export const getShareUrl = () => {
  const parts = window.location.href.split('/');
  parts.push(parts.pop() === '1' ? '0' : '1');
  return parts.join('/');
};

export const shareGame = () => {
  const url = getShareUrl();
  const opponentGame = {
    title: 'Hive board game',
    text: 'Join me in a game of the Hive!',
    url,
  };
  try {
    navigator.share(opponentGame).then();
    return false;
  } catch {
    try {
      navigator.clipboard.writeText(opponentGame.url).then();
      return true;
    } catch {
      return fallbackCopyTextToClipboard(opponentGame.url);
    }
  }
  return false;
};
