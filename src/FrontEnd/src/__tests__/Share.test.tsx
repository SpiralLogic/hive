import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import { mockExecCommand, renderElement } from './test-helpers';
import Share from '../components/Share';
import userEvent from '@testing-library/user-event';

describe('Share tests', () => {
  test('Share modal calls close', () => {
    const restore = mockExecCommand();
    const close = jest.fn();
    render(<Share setShowShare={close} />);
    userEvent.click(screen.getByRole('button'));

    expect(close).toBeCalledWith(false);
    restore();
  });

  test('snapshot', () => {
    expect(renderElement(<Share setShowShare={() => ({})} />)).toMatchSnapshot();
  });
});
