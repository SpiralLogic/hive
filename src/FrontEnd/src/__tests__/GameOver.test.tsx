import { h } from 'preact';
import GameOver from '../components/GameOver';
import { renderElement } from './test-helpers';

describe('GameOver snapshot tests', () => {
  test('win snapshot', () => {
    expect(renderElement(<GameOver win={true} />)).toMatchSnapshot();
  });
  test('lose snapshot', () => {
    expect(renderElement(<GameOver win={false} />)).toMatchSnapshot();
  });
});
