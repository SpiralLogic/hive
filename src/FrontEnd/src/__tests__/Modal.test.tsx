import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import Modal from '../components/Modal';
import { renderElement } from './test-helpers';

describe('modal snapshot tests', () => {
  it('click on modal background calls close', () => {
    const close = jest.fn();
    const modal = renderElement(<Modal visible={true} name="test" onClose={close} />);
    fireEvent.click(modal);

    expect(close).toHaveBeenCalledWith();
  });

  it('snapshot', () => {
    expect(renderElement(<Modal visible={true} name="test" onClose={() => ({})} />)).toMatchSnapshot();
  });
});
