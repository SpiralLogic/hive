export class EventEmitter<TEvent> {
    private listeners = new Set<EventListener<TEvent>>();

    add = (...listeners: EventListener<TEvent>[]) => {
        listeners.forEach((l) => this.listeners.add(l));
    };

    emit = (event: TEvent) => {
        this.listeners.forEach((l) => l(event));
    };

    remove = (...listeners: EventListener<TEvent>[]) => {
        listeners.forEach((l) => this.listeners.delete(l));
    };
}

type EventListener<TEvent> = (event: TEvent) => void;
