import { HexCoordinates, TileId } from '../domain';
import { EventEmitter } from './event-emitter';

export type TileDragEvent = {
    type: 'start' | 'end';
    tileId: TileId;
    moves: HexCoordinates[];
};

export class TileDragEmitter extends EventEmitter<TileDragEvent> {
}

const tileDragEmitter = new TileDragEmitter();

export const useTileDragEmitter = () => tileDragEmitter;
