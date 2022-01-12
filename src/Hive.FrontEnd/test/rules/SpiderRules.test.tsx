import { render } from '@testing-library/preact';
import SpiderRules from '../../src/components/rules/SpiderRules';

describe('<SpiderRules>', () => {
  it('renders', () => {
    const Rule = SpiderRules.RuleComponent;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
