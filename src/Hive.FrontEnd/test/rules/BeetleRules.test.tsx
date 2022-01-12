import { render } from '@testing-library/preact';
import BeetleRules from '../../src/components/rules/BeetleRules';

describe('<BeetleRules>', () => {
  it('renders', () => {
    const Rule = BeetleRules.RuleComponent;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
