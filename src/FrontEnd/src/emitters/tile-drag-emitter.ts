import {EventEmitter} from './event-emitter';
import {Tile} from '../domain';

export type TileDragEvent = {
    type: 'start' | 'end' | 'click';
    tile: Tile;
};

export class TileDragEmitter extends EventEmitter<TileDragEvent> {
}

const tileDragEmitter = new TileDragEmitter();

export const useTileDragEmitter = () => tileDragEmitter;
