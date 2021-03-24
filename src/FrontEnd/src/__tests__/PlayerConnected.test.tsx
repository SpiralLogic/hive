import { h } from 'preact';
import PlayerConnected from '../components/PlayerConnected';
import { renderElement } from './helpers';
import Links from '../components/Links';

describe('Player connected snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<PlayerConnected />)).toMatchSnapshot();
  });
});
