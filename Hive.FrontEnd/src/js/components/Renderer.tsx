import * as React from 'react';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import * as ReactDOM from 'react-dom';
import { IEngine } from '../domain';
import { GameArea } from './GameArea';

/**
 * Options to pass to the renderGame method, including the rules engine
 * and containing dom element
 */
interface IRenderOptions {
  /**
   * The rules engine that the renderer will request initial and subsequent
   * game states from.
   */
  engine: IEngine;
  /**
   * The dom element to mount the game area in.
   */
  container: Element;
}

/**
 *
 * @param options
 */
export const renderGame = ({ engine, container }: IRenderOptions) => {
    if (!container) {
        throw new Error('Unable to render game. No container provided.');
    }
    ReactDOM.render(<DndProvider backend={Backend}><GameArea engine={engine}/></DndProvider>, container);
};
