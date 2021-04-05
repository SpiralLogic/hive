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
    const response = await this.postRequest(`/api/move/${gameId}`, move);
    if (!useAi) return response.json();
    return (
      await this.postRequest(`/api/ai-move/${gameId}/${window.history.state.playerId == 0 ? 1 : 0}`)
    ).json();
  };

  private postRequest = (url: string, body?: Move) => {
    return fetch(url, {
      method: 'POST',
      headers: this.requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  private requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}
