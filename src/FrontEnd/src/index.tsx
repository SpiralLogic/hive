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

document.body.insertAdjacentHTML('beforeend', creatures);
const [, route, gameId, routePlayerId] = window.location.pathname.split('/');

render(h(App, { engine: new GameEngine(route, gameId, routePlayerId) }), document.body);
