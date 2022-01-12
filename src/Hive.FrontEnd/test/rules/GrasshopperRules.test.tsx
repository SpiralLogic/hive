import { render } from '@testing-library/preact';
import GrasshopperRules from '../../src/components/rules/GrasshopperRules';

describe('<GrasshopperRules>', () => {
  it('renders', () => {
    const Rule = GrasshopperRules.RuleComponent;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
