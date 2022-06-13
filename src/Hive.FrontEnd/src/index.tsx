import { h, render } from 'preact';

import App from './components/App';
import { serverConnectionFactory } from './services';
import GameEngine from './services/game-engine';
// @ts-expect-error
import creatures from './svg/creatures.svg';

if (process.env.NODE_ENV !== 'production') {
  // @ts-expect-error
  import('preact/debug');
}

document.body.insertAdjacentHTML('beforeend', creatures);
const [, , gameId, currentPlayer] = window.location.pathname.split('/');

render(
  h(App, {
    engine: new GameEngine({ gameId, currentPlayer }),
    connectionFactory: serverConnectionFactory,
  }),
  document.body
);
export { removeOtherPlayerMoves } from './utilities/hextille';
export { cellKey } from './utilities/hextille';
