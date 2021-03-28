import { h } from 'preact';
import PlayerConnected from '../components/PlayerConnected';
import { renderElement } from './test-helpers';

describe('Player connected snapshot tests', () => {
  test('Player connected snapshot', () => {
    expect(renderElement(<PlayerConnected connected={'connected'} close={() => {}} />)).toMatchSnapshot();
  });
  test('Player disconnected snapshot', () => {
    expect(renderElement(<PlayerConnected connected={'disconnected'} close={() => {}} />)).toMatchSnapshot();
  });
});
