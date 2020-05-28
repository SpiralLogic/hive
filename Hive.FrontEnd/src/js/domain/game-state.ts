import { Cell } from './cell';
import { Player } from './player';

export interface GameState {
    cells: Cell[];
    players: Player[];
}
