import { Tile } from '../domain';
import { EventEmitter } from './event-emitter';

export type TileDragEvent = {
    type: 'start' | 'end';
    tile: Tile;
};

export class TileDragEmitter extends EventEmitter<TileDragEvent> {}

const tileDragEmitter = new TileDragEmitter();

export const useTileDragEmitter = () => tileDragEmitter;
