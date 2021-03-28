import { h } from 'preact';
import { renderElement } from '../test-helpers';
import GrasshopperRules from '../../components/rules/GrasshopperRules';

describe('grasshopper Rule snapshot tests', () => {
  it('snapshot', () => {
    expect(renderElement(<GrasshopperRules />)).toMatchSnapshot();
  });
});
