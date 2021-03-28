import { h } from 'preact';
import GameOver from '../components/GameOver';
import { renderElement } from './test-helpers';

describe('gameOver snapshot tests', () => {
  it('win snapshot', () => {
    expect(renderElement(<GameOver win={true} />)).toMatchSnapshot();
  });
  it('lose snapshot', () => {
    expect(renderElement(<GameOver win={false} />)).toMatchSnapshot();
  });
});
