import { GameId, GameState, Move, PlayerId } from '../domain';
import { HexEngine } from '../domain/engine';

export default class GameEngine implements HexEngine {
  public playerId: PlayerId;
  public initialGame: Promise<GameState>;

  constructor(route: string, gameId: string, playerId: string) {
    const loadExistingGame = gameId && playerId && route === 'game';
    const getInitial = loadExistingGame ? this.getExistingGame : this.getNewGame;
    this.playerId = Number(playerId) || 0;
    this.initialGame = getInitial(gameId);
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
    const body = { ...move, useAi };

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
