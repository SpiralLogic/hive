if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import('preact/debug');
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import creatures from './svg/creatures.svg';

import { h, render } from 'preact';
import App from './components/App';
import GameEngine from './services/game-engine';
import { serverConnectionFactory } from './services';

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
