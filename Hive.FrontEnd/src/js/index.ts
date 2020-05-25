import {createElement} from 'react';
import {render} from 'react-dom';
import App from './components/App';
require('../index.html');
import "preact/debug";

render(createElement(App), document.getElementById('hive'));
