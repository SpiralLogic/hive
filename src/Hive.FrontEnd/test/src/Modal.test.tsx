import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Modal from '../../src/components/Modal';

describe('<Modal>', () => {
  it('click on modal background calls close', async () => {
    const close = jest.fn();
    render(<Modal visible={true} name="test" onClose={close} />);
    await userEvent.click(screen.getByTestId('modal'));

    expect(close).toHaveBeenCalledWith();
  });

  it('renders', () => {
    expect(render(<Modal visible={true} name="test" onClose={() => ({})} />)).toMatchSnapshot();
  });
});
