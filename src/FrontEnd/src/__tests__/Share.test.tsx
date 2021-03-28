import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Share from '../components/Share';
import { mockExecCommand, renderElement } from './test-helpers';

describe('share tests', () => {
  it('share modal calls close', () => {
    const restore = mockExecCommand();
    const close = jest.fn();
    render(<Share setShowShare={close} />);
    userEvent.click(screen.getByRole('button'));

    expect(close).toHaveBeenCalledWith(false);
    restore();
  });

  it('snapshot', () => {
    expect(renderElement(<Share setShowShare={() => ({})} />)).toMatchSnapshot();
  });
});
