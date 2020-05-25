import {createElement,render} from 'preact/compat';
import App from './components/App';
import "preact/debug";

// @ts-ignore
render(createElement(App), document.getElementById('hive'));
