import type { Environment } from 'vitest';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
export default <Environment>{
  name: 'custom',
  setup(global) {
    const window = JSDOM.fromURL('https://example.com/');
    global.window = window;
    global.document = global.window.document;
    return {
      teardown() {
        window.close();
        // called after all tests with this env have been run
      },
    };
  },
};