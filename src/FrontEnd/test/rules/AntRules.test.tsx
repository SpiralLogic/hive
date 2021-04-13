import { h } from 'preact';
import { renderElement } from '../test-helpers';
import AntRules from '../../src/components/rules/AntRules';

describe('ant Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = AntRules.Rule;
    expect(renderElement(<Rule />)).toMatchSnapshot();
  });
});
