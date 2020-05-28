import { HexCoordinates, TileId } from '../domain';
import { EventEmitter } from './event-emitter';

export class CellDropEmitter extends EventEmitter<CellDropEvent> {
}

export type CellDropListener<CellDropEvent> = (event: CellDropEvent) => void;

const cellDropEmitter = new CellDropEmitter();

export type CellDropEvent = {
    type: 'drop';
    coords: HexCoordinates;
    tileId: TileId;
};

export const useCellDropEmitter = () => cellDropEmitter;
