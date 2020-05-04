import { IPlayer, PlayerId } from './IPlayer'
import { ICell } from './ICell'

/**
 * Represents a single, complete, point-in-time snapshot of a game
 * including players, cells, and tiles on the board along with available moves
 * and style customisations.
 */
export interface IGameState {
  /**
   * A list of all known cells in the game
   */
  cells: ICell[];
  /**
   * A list of all players in the game
   */
  players: IPlayer[];
}

export const getPlayer = (gameState: IGameState, playerId: PlayerId): IPlayer | null => {
  return gameState.players.find(p => p.id === playerId) || null
}