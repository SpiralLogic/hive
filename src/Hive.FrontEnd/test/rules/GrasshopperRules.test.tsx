import { render } from '@testing-library/preact';
import GrasshopperRules from '../../src/components/rules/GrasshopperRules';

describe('<GrasshopperRules>', () => {
  it('snapshot', () => {
    const Rule = GrasshopperRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
