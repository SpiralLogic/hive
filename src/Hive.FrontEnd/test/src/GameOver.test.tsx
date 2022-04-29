import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GameOver from '../../src/components/GameOver';
import { GameStatus } from '../../src/domain';
import { mockLocation } from '../helpers';

const gameOutcomes: Array<GameStatus> = [
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

describe('<GameOver>', () => {
  it('redirects to base url when close button is pressed', async () => {
    const location = { assign: jest.fn() };
    const restore = mockLocation(location);
    render(<GameOver outcome="Draw" />);

    await userEvent.click(screen.getByRole('button'));
    expect(location.assign).toBeCalledWith('/');
    restore();
  });

  test.each(gameOutcomes)(`%s player 0 snapshot`, (gameOutcome) => {
    expect(render(<GameOver outcome={gameOutcome} />)).toMatchSnapshot();
  });

  test.each(gameOutcomes)(`%s player 1 snapshot`, (gameOutcome) => {
    expect(render(<GameOver outcome={gameOutcome} />)).toMatchSnapshot();
  });
});
