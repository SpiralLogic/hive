import { fireEvent, render} from '@testing-library/preact';
import { h } from 'preact';
import { renderElement } from './helpers';
import Modal from '../components/Modal';

describe('Modal snapshot tests', () => {
  test('click on modal background calls close', () => {
    const close = jest.fn();
    render(<Modal name='test' onClose={close} />);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.click(document.querySelector('.modal')!);

    expect(close).toBeCalled();
  });
  
  test('snapshot', () => {
    expect(renderElement(<Modal name="test" onClose={() => ({})} />)).toMatchSnapshot();
  });
});
