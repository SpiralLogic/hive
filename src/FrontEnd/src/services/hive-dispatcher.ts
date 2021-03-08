import { Move, Tile } from '../domain';

export class HiveDispatcher {
  private listeners = new Map<string, Set<HiveEventListener<HiveIntent>>>();

  add = <T extends HiveIntent>(type: T['type'], listener: HiveEventListener<T>): (() => void) => {
    if (!this.listeners.get(type)?.add(listener)) this.listeners.set(type, new Set([listener]));
    return () => this.remove<T>(type, listener);
  };

  dispatch = <T extends HiveIntent>(intent: T): void => {
    this.listeners.get(intent.type)?.forEach((l): void => l(intent));
  };

  remove = <T extends HiveIntent>(type: T['type'], listener: HiveEventListener<T>): void => {
    this.listeners.get(type)?.delete(listener);
  };
}

export type HiveEventListener<T extends HiveIntent> = <HiveIntent extends T>(intent: HiveIntent) => void;
export type HiveIntent = HiveEvent | HiveAction;
export type HiveEvent = MoveEvent | TileEvent;
export type HiveAction = Action | TileAction;
export type MoveEvent = { type: 'move'; move: Move };
export type Action = {
  type: 'tileClear';
};
export type TileEvent = {
  type: 'tileDropped' | 'click' | 'tileSelected' | 'tileDeselected';
  tile: Tile;
};
export type TileAction = {
  type: 'tileSelect' | 'tileDeselect';
  tile: Tile;
};
