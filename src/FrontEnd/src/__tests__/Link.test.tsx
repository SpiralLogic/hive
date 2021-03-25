import { h } from 'preact';
import { renderElement } from './test-helpers';
import Links from '../components/Links';

describe('Links snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<Links onShowShare={() => ({})} onShowRules={() => ({})} />)).toMatchSnapshot();
  });
});
