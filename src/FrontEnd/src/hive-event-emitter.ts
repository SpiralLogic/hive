import { Move, Tile } from './domain';

export class HiveEventEmitter {
  private listeners = new Map<string, Set<HiveEventListener<HiveEvent>>>();

  add = <T extends HiveEvent>(type: T['type'], listener: HiveEventListener<T>): void => {
    if (!this.listeners.get(type)?.add(listener)) this.listeners.set(type, new Set([listener]));
  };

  emit = <T extends HiveEvent>(event: T): void => {
    this.listeners.get(event.type)?.forEach((l): void => l(event));
  };

  remove = <T extends HiveEvent>(type: T['type'], listener: HiveEventListener<T>): void => {
    this.listeners.get(type)?.delete(listener);
  };
}

export type HiveEventListener<T extends HiveEvent> = <K extends T>(event: K) => void;
export type HiveEvent = MoveEvent | TileEvent | { type: 'tileClear' };
export type MoveEvent = { type: 'move'; move: Move };
export type TileEventType =
  | 'tileSelect'
  | 'tileDropped'
  | 'click'
  | 'tileDeselect'
  | 'tileSelected'
  | 'tileDeselected';
export type TileEvent = {
  type: TileEventType;
  tile: Tile;
};
