import { h } from 'preact';
import { renderElement } from './helpers';
import Share from '../components/Share';

describe('Share snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<Share setShowShare={() => ({})} />)).toMatchSnapshot();
  });
});
