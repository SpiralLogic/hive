import { h, render } from 'preact';
import App from './components/App';
import { serverConnectionFactory } from './services';
import creatures from './svg/creatures.svg?raw';

import GameEngine from './services/game-engine';

document.body.insertAdjacentHTML('beforeend', `${creatures}`);
document.title = import.meta.env.HIVE_APP_TITLE;

const [, , gameId, currentPlayer] = window.location.pathname.split('/');
const engine = new GameEngine({ gameId, currentPlayer });
const properties = {
  engine,
  connectionFactory: serverConnectionFactory,
};

render(h(App, properties), document.body);

export { removeOtherPlayerMoves } from './utilities/hextille';
export { cellKey } from './utilities/hextille';
console.log(import.meta.env);
