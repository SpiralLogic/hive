import { EventEmitter } from './event-emitter';
import { Move, Tile } from '../domain';

export class HiveEventEmitter extends EventEmitter<HiveEvent> {}

export type HiveEventListener<TEvent> = (event: TEvent) => void;

export type HiveEvent = MoveEvent | TileEvent | { type: 'deselect' };
export type MoveEvent = { type: 'move'; move: Move };
export type TileEvent = { type: 'start' | 'end' | 'click'; tile: Tile };
