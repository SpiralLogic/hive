import { Hexagon } from './hexagon';
import { Player } from './player';

export interface GameState {
    hexagons: Hexagon[];
    players: Player[];
}
