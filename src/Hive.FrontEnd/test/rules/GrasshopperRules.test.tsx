import { render } from '@testing-library/preact';
import GrasshopperRules from '../../src/components/rules/GrasshopperRules';

describe('grasshopper Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = GrasshopperRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
