import { EventEmitter } from './event-emitter';
import { Move } from '../domain';

export class CellEventEmitter extends EventEmitter<CellEvent> {}

export type CellEventListener<TEvent> = (event: TEvent) => void;

const cellEventEmitter = new CellEventEmitter();

export type CellEvent = { type: 'drop'; move: Move };

export const useCellEventEmitter = (): CellEventEmitter => cellEventEmitter;
