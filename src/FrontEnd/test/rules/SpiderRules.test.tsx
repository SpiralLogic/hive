import { h } from 'preact';
import { renderElement } from '../test-helpers';
import SpiderRules from '../../src/components/rules/SpiderRules';

describe('spider Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = SpiderRules.Rule;
    expect(renderElement(<Rule />)).toMatchSnapshot();
  });
});
