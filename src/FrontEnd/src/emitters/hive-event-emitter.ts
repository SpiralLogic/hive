import { EventEmitter } from './event-emitter';
import { Move, Tile } from '../domain';

export class HiveEventEmitter extends EventEmitter<HiveEvent> {}

export type HiveEventListener<TEvent> = (event: TEvent) => void;

const hiveEventEmitter = new HiveEventEmitter();

export type HiveEvent = MoveEvent | TileEvent;
export type MoveEvent = { type: 'move'; move: Move };
export type TileEvent = { type:  'start' | 'end' | 'click' | 'deselect'; tile: Tile; };

export const useHiveEventEmitter = (): HiveEventEmitter => hiveEventEmitter;
