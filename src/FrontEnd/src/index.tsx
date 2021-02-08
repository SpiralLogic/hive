if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import('preact/debug');
}

import './css/hive.css';
import { h, render } from 'preact';
import App from './components/App';

fetch('/svg/creatures.svg?v1')
  .then((r) => r.text())
  .then((svg) => document.body.insertAdjacentHTML('beforeend', `<div class="svg">${svg}</div>`));

fetch('/svg/share.svg?v1')
  .then((r) => r.text())
  .then((svg) => document.body.insertAdjacentHTML('beforeend', `<div class="svg">${svg}</div>`));

render(h(App, {}), document.body);
 
