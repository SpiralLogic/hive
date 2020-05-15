import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HexEngine } from '../domain';
import { GameArea } from './GameArea';

interface IRenderOptions {
  engine: HexEngine;
  container: Element;
}

export const renderGame = ({ engine, container }: IRenderOptions) => {
    if (!container) {
        throw new Error('Unable to render game. No container provided.');
    }
    ReactDOM.render(<GameArea engine={engine}/>, container);
};
