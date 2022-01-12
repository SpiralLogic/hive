import { render } from '@testing-library/preact';
import RuleCell from '../../src/components/rules/RuleCell';

describe('<RuleCell>', () => {
  it('renders', () => {
    expect(render(<RuleCell />).baseElement).toMatchSnapshot();
  });
});
