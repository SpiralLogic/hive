import { Hexagon } from './hexagon';
import { Player, PlayerId } from './player';

export interface GameState {
  hexagons: Hexagon[];
  players: Player[];
}

export const getPlayer = (gameState: GameState, playerId: PlayerId) => {
    return gameState.players.find(p => p.id === playerId) || null;
};