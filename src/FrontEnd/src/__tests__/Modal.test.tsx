import { h } from 'preact';
import { renderElement } from './helpers';
import Modal from '../components/Modal';

describe('Modal snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<Modal name="test" onClose={() => ({})} />)).toMatchSnapshot();
  });
});
