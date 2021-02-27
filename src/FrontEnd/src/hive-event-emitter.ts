import { Move, Tile } from './domain';

type EventListener<TEvent> = (event: TEvent) => void;

class EventEmitter<TEvent> {
  private listeners = new Set<EventListener<TEvent>>();

  add = (...listeners: EventListener<TEvent>[]): void => {
    listeners.forEach((l) => this.listeners.add(l));
  };

  emit = (event: TEvent): void => {
    this.listeners.forEach((l): void => l(event));
  };

  remove = (...listeners: EventListener<TEvent>[]): void => {
    listeners.forEach((l) => this.listeners.delete(l));
  };
}

export class HiveEventEmitter extends EventEmitter<HiveEvent> {}
export type HiveEventListener<TEvent> = (event: TEvent) => void;
export type HiveEvent = MoveEvent | TileEvent | { type: 'tileClear' };
export type MoveEvent = { type: 'move'; move: Move };
export type TileEvent = {
  type:
    | 'tileSelect'
    | 'tileDropped'
    | 'click'
    | 'tileClear'
    | 'tileDeselect'
    | 'tileSelected'
    | 'tileDeselected';
  tile: Tile;
};
