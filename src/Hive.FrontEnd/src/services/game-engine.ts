import { GameState, Move } from '../domain';
import { AiMode, HexEngine } from '../domain/engine';
import { getAllPlayerTiles } from '../utilities/hextille';

export default class GameEngine implements HexEngine {
  public currentPlayer: number;
  public initialGame: Promise<GameState>;
  public gameId: string;
  public onAiMode: (aiMode: AiMode) => void = () => {};
  #aiMode: AiMode;

  private currentRequest: Promise<GameState>;
  private requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  constructor(existingGame?: { gameId: string; currentPlayer: string }) {
    this.currentPlayer = Number(existingGame?.currentPlayer ?? 0);
    this.gameId = existingGame?.gameId ?? '';
    this.#aiMode = this.currentPlayer === 0 ? 'on' : 'off';
    this.currentRequest = existingGame?.gameId
      ? this.getExistingGame(existingGame.gameId)
      : this.getNewGame();

    this.initialGame = this.completeRequest();
    void this.setAiMode(this.#aiMode);
  }

  get aiMode(): AiMode {
    return this.#aiMode;
  }

  set aiMode(aiMode: AiMode) {
    this.#aiMode = aiMode;
    this.onAiMode(aiMode);
    void this.setAiMode(this.#aiMode);
  }

  private setAiMode = async (mode: AiMode) => {
    if (mode === 'on') {
      const { cells, players } = await this.completeRequest();
      if (
        getAllPlayerTiles(this.currentPlayer, players, cells).reduce(
          (count, tile) => count + tile.moves.length,
          0
        ) === 0
      ) {
        await this.aiMove();
      }
    }
    let result = true;
    while (this.#aiMode === 'auto' && result) {
      try {
        await this.aiMove();
      } catch {
        result = false;
      }
    }
    await this.completeRequest();
  };

  move = async (move: Move): Promise<GameState> => {
    await this.postRequest(`/api/move/${this.gameId}`, move);
    if (this.#aiMode === 'on') {
      await this.completeRequest();
      return this.aiMove();
    }
    return this.completeRequest();
  };

  private aiMove = async (): Promise<GameState> => {
    await this.postRequest(`/api/ai-move/${this.gameId}`);

    return this.completeRequest();
  };

  private completeRequest = async () => {
    const response = await this.currentRequest;
    if (!this.gameId) this.gameId = response.gameId;
    return response;
  };

  private getExistingGame = async (gameId: string) => {
    return this.getRequest(`/api/game/${gameId}`);
  };

  private getNewGame = async () => {
    return this.postRequest(`/api/new`);
  };

  private postRequest = async (url: string, body?: Move) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response?.ok) throw new Error('Error performing post request');
    this.currentRequest = response.json();
    return this.currentRequest;
  };

  private getRequest = async (url: string) => {
    const response = await fetch(url, {
      method: `GET`,
      headers: this.requestHeaders,
    });

    this.currentRequest = response.json();
    return this.currentRequest;
  };
}
