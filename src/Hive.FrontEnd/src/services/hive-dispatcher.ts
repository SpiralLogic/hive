import { Move, Tile } from '../domain';

export type HiveEventListener<T extends HiveIntent> = (intent: T) => Promise<void> | void;
export type HiveIntent = HiveEvent | HiveAction;
export type HiveEvent = MoveEvent | TileEvent | ConnectEvent;
export type HiveAction = Action | TileAction;
export type MoveEvent = { type: 'move'; move: Move };
export type Action = {
  type: 'tileClear';
};
export type ConnectEvent = { type: 'opponentConnected' | 'opponentDisconnected'; playerId: number };
export type TileEvent = {
  type: 'tileDropped' | 'click' | 'tileSelected' | 'tileDeselected';
  tile: Omit<Tile, 'moves'>;
  fromEvent?: boolean;
};
export type TileAction = {
  type: 'tileSelect' | 'tileDeselect';
  tile: Omit<Tile, 'moves'>;
};

function isIntentFor<T extends HiveIntent>(type: T['type'], intent: HiveIntent): intent is T {
  return intent.type === type;
}

type Subscription = {
  subscriber: unknown;
  deliver: HiveEventListener<HiveIntent>;
};

export class HiveDispatcher {
  private readonly byType = new Map<string, Subscription[]>();

  add = <T extends HiveIntent>(type: T['type'], listener: HiveEventListener<T>): (() => void) => {
    const row = this.byType.get(type) ?? [];
    row.push({
      subscriber: listener,
      deliver: (intent) => {
        if (!isIntentFor(type, intent)) return;
        void listener(intent);
      },
    });
    this.byType.set(type, row);
    return () => this.remove(type, listener);
  };

  dispatch(intent: HiveIntent): void {
    for (const { deliver } of this.byType.get(intent.type) ?? []) deliver(intent);
  }

  remove = <T extends HiveIntent>(type: T['type'], listener: HiveEventListener<T>): void => {
    const row = this.byType.get(type);
    if (!row) return;
    const index = row.findIndex((s) => s.subscriber === listener);
    if (index !== -1) row.splice(index, 1);
  };
}
