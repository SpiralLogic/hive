import { h } from 'preact';
import { renderElement } from '../test-helpers';
import GrasshopperRules from '../../components/rules/GrasshopperRules';

describe('Grasshopper Rule snapshot tests', () => {
  test('snapshot', () => {
    expect(renderElement(<GrasshopperRules />)).toMatchSnapshot();
  });
});
