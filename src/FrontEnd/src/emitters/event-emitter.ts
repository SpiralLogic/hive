export class EventEmitter<TEvent> {
  private listeners = new Set<EventListener<TEvent>>();

  add = (...listeners: EventListener<TEvent>[]): void => {
    listeners.forEach((l) => this.listeners.add(l));
  };

  emit = (event: TEvent) => {
    this.listeners.forEach((l): void => l(event));
  };

  remove = (...listeners: EventListener<TEvent>[]): void => {
    listeners.forEach((l) => this.listeners.delete(l));
  };
}

type EventListener<TEvent> = (event: TEvent) => void;
