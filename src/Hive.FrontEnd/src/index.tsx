import { h, render } from 'preact';
import App from '@hive/components/App';
import { serverConnectionFactory } from '@hive/services';
import GameEngine from '@hive/services/game-engine';
import creatures from '@hive/svg/creatures.svg';

document.body.insertAdjacentHTML('beforeend', `${creatures}`);
document.title = import.meta.env.HIVE_APP_TITLE;

const [, , gameId, currentPlayer] = window.location.pathname.split('/');
const engine = new GameEngine({ gameId, currentPlayer });
const properties = {
  engine,
  connectionFactory: serverConnectionFactory,
};

render(h(App, properties), document.body);
