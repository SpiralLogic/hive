import { h } from 'preact';
import GameOver from '../components/GameOver';
import { renderElement } from './helpers';

describe('GameOver snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<GameOver win={false} />)).toMatchSnapshot();
  });
});
