import { h } from 'preact';
import { renderElement } from '../test-helpers';
import GrasshopperRules from '../../components/rules/GrasshopperRules';

describe('grasshopper Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = GrasshopperRules.Rule;
    expect(renderElement(<Rule />)).toMatchSnapshot();  });
});
