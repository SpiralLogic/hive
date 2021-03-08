if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import('preact/debug');
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import creatures from './svg/creatures.svg';

import './css/hive.css';
import { h, render } from 'preact';
import App from './components/App';
import GameEngine from './services/game-engine';

document.body.insertAdjacentHTML('beforeend', creatures);

render(h(App, { engine: new GameEngine() }), document.body);
