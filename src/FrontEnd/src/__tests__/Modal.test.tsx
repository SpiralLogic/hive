import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { renderElement } from './test-helpers';
import Modal from '../components/Modal';

describe('modal snapshot tests', () => {
  test('click on modal background calls close', () => {
    const close = jest.fn();
    const modal = renderElement(<Modal name="test" onClose={close} />);
    fireEvent.click(modal);

    expect(close).toHaveBeenCalledWith();
  });

  test('snapshot', () => {
    expect(renderElement(<Modal name="test" onClose={() => ({})} />)).toMatchSnapshot();
  });
});
