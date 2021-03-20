import { GameId, GameState, Move } from '../domain';
import { HexEngine } from '../domain/engine';

export default class GameEngine implements HexEngine {
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

  moveTile = async (gameId: GameId, move: Move): Promise<GameState> => {
    const body = !document.location.search.toLowerCase().includes('useai=true')
      ? move
      : { ...move, useAi: true };

    const response = await fetch(`/api/move/${gameId}`, {
      method: 'POST',
      headers: this.requestHeaders,
      body: JSON.stringify(body),
    });

    return response.json();
  };

  private requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}
