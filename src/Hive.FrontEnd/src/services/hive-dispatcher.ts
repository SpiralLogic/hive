import { Move, PlayerId, Tile } from '../domain';
import { AiMode } from '../domain/engine';

export type HiveEventListener<T extends HiveIntent> = <U extends T>(intent: U) => void;
export type HiveIntent = HiveEvent | HiveAction;
export type HiveEvent = MoveEvent | TileEvent | AiAction | ConnectEvent;
export type HiveAction = Action | TileAction;
export type MoveEvent = { type: 'move'; move: Move };
export type Action = {
  type: 'tileClear';
};
export type AiAction = { type: 'toggleAi'; newState: AiMode };

export type ConnectEvent = { type: 'opponentConnected' | 'opponentDisconnected'; playerId: PlayerId };
export type TileEvent = {
  type: 'tileDropped' | 'click' | 'tileSelected' | 'tileDeselected';
  tile: Tile;
  fromEvent?: boolean;
};
export type TileAction = {
  type: 'tileSelect' | 'tileDeselect';
  tile: Tile;
};

export class HiveDispatcher {
  private listeners = new Map<string, Set<HiveEventListener<HiveIntent>>>();

  add = <T extends HiveIntent>(type: T['type'], listener: HiveEventListener<T>): (() => void) => {
    if (!this.listeners.get(type)?.add(listener)) this.listeners.set(type, new Set([listener]));
    return () => this.remove<T>(type, listener);
  };

  dispatch = <T extends HiveIntent>(intent: T): void => {
    const listeners = this.listeners.get(intent.type) ?? [];
    for (const l of listeners) {
      l(intent);
    }
  };

  remove = <T extends HiveIntent>(type: T['type'], listener: HiveEventListener<T>): void => {
    this.listeners.get(type)?.delete(listener);
  };
}
