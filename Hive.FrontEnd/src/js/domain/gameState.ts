import { Hexagon } from './hexagon';
import { Player, PlayerId } from './player';

export interface GameState {
  hexagons: Hexagon[];
  players: Player[];
}