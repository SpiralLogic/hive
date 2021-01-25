import {GameId} from "./game-state";
import {HexCoordinates} from './hex-coordinates';
import {TileId} from './tile';

export type Move = {
    tileId: TileId;
    coords: HexCoordinates;
};

export type MoveTile = (gameId: GameId, move: Move) => void;
