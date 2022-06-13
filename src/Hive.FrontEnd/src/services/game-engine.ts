import { GameId, GameState, Move, PlayerId } from '../domain';
import { AiMode, HexEngine } from '../domain/engine';

export default class GameEngine implements HexEngine {
  public aiMode: AiMode;
  public currentPlayer: PlayerId;
  public initialGame: Promise<GameState>;
  public gameId: GameId;

  constructor(existingGame?: { gameId: string; currentPlayer: string }) {
    this.currentPlayer = Number(existingGame?.currentPlayer ?? 0);
    this.gameId = existingGame?.gameId ?? '';
    this.aiMode = 'on';
    this.initialGame = existingGame?.gameId ? this.getExistingGame(existingGame.gameId) : this.getNewGame();
  }

  move = async (move: Move): Promise<GameState> => {
    const response = await this.postRequest(`/api/move/${this.gameId}`, move);
    if (this.aiMode === 'on') {
      return this.aiMove();
    }
    return response.json();
  };

  private aiMove = async (): Promise<GameState> => {
    const response = await this.postRequest(`/api/ai-move/${this.gameId}/${this.currentPlayer == 0 ? 1 : 0}`);
    return response.json();
  };

  private getExistingGame = async (gameId: GameId): Promise<GameState> => {
    const response = await fetch(`/api/game/${gameId}`, {
      method: `GET`,
      headers: this.requestHeaders,
    });

    const responseJson = (await response.json()) as GameState;
    this.gameId = responseJson.gameId;
    return responseJson;
  };

  private getNewGame = async (): Promise<GameState> => {
    const response = await this.postRequest(`/api/new`);
    const responseJson = (await response.json()) as GameState;
    this.gameId = responseJson.gameId;
    return responseJson;
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
