import { h } from 'preact';
import { renderElement } from '../test-helpers';
import SpiderRules from '../../components/rules/SpiderRules';

describe('spider Rule snapshot tests', () => {
  it('snapshot', () => {
    expect(renderElement(<SpiderRules />)).toMatchSnapshot();
  });
});
