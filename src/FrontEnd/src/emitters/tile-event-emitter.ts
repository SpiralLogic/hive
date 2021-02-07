import { EventEmitter } from './event-emitter';
import { Tile } from '../domain';

export type TileEvent = {
  type: 'start' | 'end' | 'click' | 'deselect';
  tile: Tile;
};

export class TileEventEmitter extends EventEmitter<TileEvent> {}

const tileEventEmitter = new TileEventEmitter();

export const useTileEventEmitter = () => tileEventEmitter;
