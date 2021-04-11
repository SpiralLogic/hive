import { h } from 'preact';
import { renderElement } from '../test-helpers';
import BeetleRules from '../../components/rules/BeetleRules';

describe('beetle Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = BeetleRules.Rule;
    expect(renderElement(<Rule />)).toMatchSnapshot();  });
});
