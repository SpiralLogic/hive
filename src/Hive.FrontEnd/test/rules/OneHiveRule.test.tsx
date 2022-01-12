import { render } from '@testing-library/preact';
import OneHiveRule from '../../src/components/rules/OneHiveRule';

describe('<OneHiveRule>', () => {
  it('renders', () => {
    const Rule = OneHiveRule.RuleComponent;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
