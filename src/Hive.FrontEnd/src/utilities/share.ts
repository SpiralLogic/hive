export const getShareUrl = (gameId: string, currentPlayer: number) =>
  `${window.location.origin}/game/${gameId}/${currentPlayer === 1 ? '0' : '1'}`;

export const shareGame = async (gameId: string, currentPlayer: number) => {
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
      return false;
    }
  }
};
