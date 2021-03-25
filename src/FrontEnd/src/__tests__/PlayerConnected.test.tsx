import { h } from 'preact';
import PlayerConnected from '../components/PlayerConnected';
import { renderElement } from './test-helpers';

describe('Player connected snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<PlayerConnected />)).toMatchSnapshot();
  });
});
