export type EventEmitter<Event> = {
    emit: (event: Event) => void;
    add: (...listeners: EventListener<Event>[]) => void;
    remove: (...listeners: EventListener<Event>[]) => void;
};

export type EventListener<E> = (event: E) => void;

export type Event = { type: string };
