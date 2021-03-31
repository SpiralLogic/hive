import { GameId, GameState, Move, PlayerId } from '../domain';
import { HexEngine } from '../domain/engine';

export default class GameEngine implements HexEngine {
  public playerId: PlayerId;
  public initialGame: Promise<GameState>;

  constructor(existingConfig?: { route: string; gameId: string; playerId: string }) {
    this.playerId = Number(existingConfig?.playerId) || 0;
    this.initialGame =
      existingConfig && existingConfig.route === 'game'
        ? this.getExistingGame(existingConfig.gameId)
        : this.getNewGame();
  }

  getExistingGame = async (gameId: GameId): Promise<GameState> => {
    const response = await fetch(`/api/game/${gameId}`, {
      method: `GET`,
      headers: this.requestHeaders,
    });

    return response.json();
  };

  getNewGame = async (): Promise<GameState> => {
    const response = await fetch(`/api/new`, {
      method: `POST`,
      headers: this.requestHeaders,
      body: JSON.stringify(''),
    });
    return response.json();
  };

  move = async (gameId: GameId, move: Move, useAi: boolean): Promise<GameState> => {
    const response = await fetch(`/api/move/${gameId}`, {
      method: 'POST',
      headers: this.requestHeaders,
      body: JSON.stringify(move),
    });
    if (useAi) {
      return (
        await fetch(`/api/ai-move/${gameId}/1`, {
          method: 'POST',
          headers: this.requestHeaders,
          body: JSON.stringify(move),
        })
      ).json();
    }
    return response.json();
  };

  private requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}
