import { fireEvent, render } from '@testing-library/preact';
import { h } from 'preact';
import { renderElement } from './helpers';
import Modal from '../components/Modal';

describe('modal snapshot tests', () => {
  it('click on modal background calls close', () => {
    const close = jest.fn();
    render(<Modal name="test" onClose={close} />);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.click(document.querySelector('.modal')!);

    expect(close).toHaveBeenCalledWith();
  });

  it('snapshot', () => {
    expect(renderElement(<Modal name="test" onClose={() => ({})} />)).toMatchSnapshot();
  });
});
