if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  import('preact/debug');
}

import { h, render } from 'preact';
import App from './components/App';
import './css/hive.css';

fetch('/svg/creatures.svg')
  .then((r) => r.text())
  .then((svg) =>
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="svg">${svg}</div>`
    )
  );

fetch('/svg/share.svg')
  .then((r) => r.text())
  .then((svg) =>
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="svg">${svg}</div>`
    )
  );

render(h(App, {}), document.body);
