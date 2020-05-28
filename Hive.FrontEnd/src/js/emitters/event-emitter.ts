export class EventEmitter<Event> {
    private listeners = new Set<EventListener<Event>>();

    add(...listeners: EventListener<Event>[]) {
        listeners.forEach((l) => this.listeners.add(l));
    }

    emit(event: Event) {
        this.listeners.forEach((l) => l(event));
    }

    remove(...listeners: EventListener<Event>[]) {
        listeners.forEach((l) => this.listeners.delete(l));
    }
}
type EventListener<Event> = (event: Event) => void;

export interface Event { type: string }
