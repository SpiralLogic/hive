import { GameState, Move } from '../domain';
import { AiMode, HexEngine } from '../domain/engine';
import { getAllPlayerTiles } from '../utilities/hextille';
import { effect, Signal, signal } from '@preact/signals';

export default class GameEngine implements HexEngine {
  public currentPlayer: number;
  public initialGame: Promise<GameState>;
  public gameId: string;
  private readonly aiMode: Signal<AiMode>;
  private currentRequest: Promise<GameState>;
  private requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  constructor(existingGame?: { gameId: string; currentPlayer: string }) {
    this.currentPlayer = Number(existingGame?.currentPlayer ?? 0);
    this.gameId = existingGame?.gameId ?? '';
    this.aiMode = signal<AiMode>(this.currentPlayer === 0 ? 'on' : 'off');
    this.currentRequest = existingGame?.gameId
      ? this.getExistingGame(existingGame.gameId)
      : this.getNewGame();

    this.initialGame = this.completeRequest();
    effect(() => {
      void this.setAiMode(this.aiMode.value);
    });
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
    while (this.aiMode.value === 'auto' && result) {
      try {
        await this.aiMove();
      } catch {
        result = false;
      }
    }
    await this.completeRequest();
  };

  getAiMode = () => this.aiMode;

  move = async (move: Move): Promise<GameState> => {
    await this.postRequest(`/api/move/${this.gameId}`, move);
    if (this.aiMode.value === 'on') {
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
