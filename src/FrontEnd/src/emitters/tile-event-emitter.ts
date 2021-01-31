import {EventEmitter} from './event-emitter';
import {Tile} from '../domain';

export type TileEvents = {
    type: 'start' | 'end' | 'click';
    tile: Tile;
};

export class TileEventEmitter extends EventEmitter<TileEvents> {
}

const tileEventEmitter = new TileEventEmitter();

export const useTileEventEmitter = () => tileEventEmitter;
