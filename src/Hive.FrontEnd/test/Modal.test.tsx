import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Modal from '../src/components/Modal';
import { renderElement } from './test-helpers';

describe('<Modal>', () => {
  it('click on modal background calls close', () => {
    const close = jest.fn();
    render(<Modal visible={true} name="test" onClose={close} />);
    userEvent.click(screen.getByTestId('modal'));

    expect(close).toHaveBeenCalledWith();
  });

  it('snapshot', () => {
    expect(renderElement(<Modal visible={true} name="test" onClose={() => ({})} />)).toMatchSnapshot();
  });
});
