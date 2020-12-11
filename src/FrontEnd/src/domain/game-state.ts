import {Cell} from './cell';
import {Player} from './player';

export type GameState = {
    cells: Cell[];
    players: Player[];
    gameId: GameId;
};

export type GameId = string;