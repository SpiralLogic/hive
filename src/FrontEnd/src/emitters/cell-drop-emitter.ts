import { EventEmitter } from './event-emitter';
import { Move } from '../domain';

export class CellDropEmitter extends EventEmitter<CellDropEvent> {}

export type CellDropListener<TCellDropEvent> = (event: TCellDropEvent) => void;

const cellDropEmitter = new CellDropEmitter();

export type CellDropEvent = { type: 'drop'; move: Move };

export const useCellDropEmitter = (): CellDropEmitter => cellDropEmitter;
