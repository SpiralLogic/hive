import { h, render } from 'preact';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import creatures from './svg/creatures.svg';

import { serverConnectionFactory } from './services';
import App from './components/App';
import GameEngine from './services/game-engine';
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  import('preact/debug');
}

document.body.insertAdjacentHTML('beforeend', creatures);
const [, route, gameId, playerId] = window.location.pathname.split('/');

render(
  h(App, {
    engine: new GameEngine({ route, gameId, playerId }),
    connectionFactory: serverConnectionFactory,
  }),
  document.body
);
export { removeOtherPlayerMoves } from './utilities/hextille';
export { cellKey } from './utilities/hextille';
