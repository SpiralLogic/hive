import { HexCoordinates, TileId } from '../domain';
import { EventEmitter, EventListener } from './event-emitter';

export type TileDragListener = EventListener<TileDragEvent>;

export type TileDragEvent = {
    type: 'start' | 'end' | 'enter' | 'leave';
    tileId: TileId;
    tileMoves: HexCoordinates[];
};

export default class TileDragEmitter implements EventEmitter<TileDragEvent> {
    private listeners = new Set<TileDragListener>();

    add(...listeners: TileDragListener[]) {
        listeners.forEach((l) => this.listeners.add(l));
    }

    emit(event: TileDragEvent) {
        this.listeners.forEach((l) => l(event));
    }

    remove(...listeners: TileDragListener[]) {
        listeners.forEach((l) => this.listeners.delete(l));
    }
}
