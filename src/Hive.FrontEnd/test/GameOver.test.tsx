import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { h } from 'preact';
import GameOver from '../src/components/GameOver';
import { GameStatus } from '../src/domain';
import { mockLocation, renderElement } from './test-helpers';

describe('gameOver snapshot tests', () => {
  test('close calls base url', () => {
    const location = { assign: jest.fn() };
    const restore = mockLocation(location);
    render(<GameOver outcome="Draw" />);

    userEvent.click(screen.getByRole('button'));
    expect(location.assign).toBeCalledWith('/');
    restore();
  });

  const outcomes: GameStatus[] = [
    'NewGame',
    'MoveSuccess',
    'AiWin',
    'Player0Win',
    'Player1Win',
    'MoveSuccessNextPlayerSkipped',
    'MoveInvalid',
    'GameOver',
    'Draw',
  ];

  outcomes.forEach((outcome) => {
    it(`${outcome} snapshot player 0`, () => {
      expect(renderElement(<GameOver outcome={outcome} />)).toMatchSnapshot();
    });

    it(`${outcome} snapshot player 1`, () => {
      expect(renderElement(<GameOver outcome={outcome} />)).toMatchSnapshot();
    });
  });
});
