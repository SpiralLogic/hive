import { h } from 'preact';
import { renderElement } from './helpers';
import Rules from '../components/Rules';

describe('Rules snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<Rules setShowRules={() => ({})} />)).toMatchSnapshot();
  });
});
