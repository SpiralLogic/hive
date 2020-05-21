import {HexCoordinates, TileId} from '../domain';
import {EventEmitter, EventListener} from './interface';

export type TileDragListener = EventListener<TileDragEvent>;

export type TileDragEvent = {
    type: 'start' | 'end',
    source: TileId,
    data: HexCoordinates[]
}

export default class TileDragEmitter implements EventEmitter<TileDragEvent> {
    private listeners = new Set<TileDragListener>();

    add(...listeners: TileDragListener[]) {
        listeners.forEach(l => this.listeners.add(l));
    }

    emit(event: TileDragEvent) {
        this.listeners.forEach(l => l(event));
    }

    remove(listener: TileDragListener) {
        this.listeners.delete(listener);
    }
}