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

export const shareGame = async (url: string) => {
  const opponentGame = {
    title: 'Hive board game',
    text: 'Join me in a game of the Hive!',
    url,
  };
  try {
    await navigator.share(opponentGame);
    return false;
  } catch {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(opponentGame.url);
        return true;
      } catch {
        return fallbackCopyTextToClipboard(opponentGame.url);
      }
    }
  }
  return false;
};
