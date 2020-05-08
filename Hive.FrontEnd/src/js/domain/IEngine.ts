import { IGameState } from './IGameState';
import { IMove } from './IMove';

/**
 * A rules engine to plug into the renderer. Allows the renderer
 * to request an initial game state, and updated states based on
 * moves
 */
export interface IEngine {
  /**
   * Returns a promise resolving the initial state of a new game.
   * Will be called before the initial render.
   * @returns Promise<IGameState>
   */
  initialState (): Promise<IGameState>;

  /**
   * When provided with a move, will return a promise resolving the
   * resulting 'next' game state.
   * @param move A tile move performed by a plaer
   */
  playMove (move: IMove): Promise<IGameState>;
}