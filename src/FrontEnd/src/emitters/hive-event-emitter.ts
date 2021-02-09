import { EventEmitter } from './event-emitter';
import { Inputs, useEffect } from 'preact/hooks';
import { Move, Tile } from '../domain';

export class HiveEventEmitter extends EventEmitter<HiveEvent> {}

export type HiveEventListener<TEvent> = (event: TEvent) => void;

const hiveEventEmitter = new HiveEventEmitter();

export type HiveEvent = MoveEvent | TileEvent | { type: 'deselect' };
export type MoveEvent = { type: 'move'; move: Move };
export type TileEvent = { type: 'start' | 'end' | 'click'; tile: Tile };

export const useHiveEventEmitter = (
  hiveEventHandler?: HiveEventListener<HiveEvent>,
  inputs?: Inputs
): HiveEventEmitter => {
  if (hiveEventHandler)
    useEffect(() => {
      hiveEventEmitter.add(hiveEventHandler);
      return () => {
        hiveEventEmitter.remove(hiveEventHandler);
      };
    }, inputs);

  return hiveEventEmitter;
};
