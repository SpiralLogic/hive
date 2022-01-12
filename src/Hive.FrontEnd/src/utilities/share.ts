import { GameId, PlayerId } from '../domain';

const fallbackCopyTextToClipboard = (text: string) => {
  const currentFocus = document.activeElement as HTMLElement;
  const textArea = document.createElement('textarea');
  textArea.value = text;

  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.append(textArea);
  textArea.focus();
  textArea.select();
  let copied: boolean;
  try {
    // noinspection JSDeprecatedSymbols
    document.execCommand('copy');
    currentFocus.focus();
    copied = true;
  } catch {
    copied = false;
  }
  textArea.remove();
  return copied;
};

export const getShareUrl = (gameId: GameId, currentPlayer: PlayerId) =>
  `//game/${gameId}/${currentPlayer === 1 ? '0' : '1'}`;

export const shareGame = async (gameId: GameId, currentPlayer: PlayerId) => {
  const url = getShareUrl(gameId, currentPlayer);
  const opponentGame = {
    title: 'Hive board game',
    text: 'Click this link to join me in a game of the Hive!',
    url,
  };
  try {
    await navigator.share(opponentGame);
    return false;
  } catch {
    try {
      await navigator.clipboard.writeText(opponentGame.url);
      return true;
    } catch {
      return fallbackCopyTextToClipboard(opponentGame.url);
    }
  }
};
