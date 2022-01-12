import { render } from '@testing-library/preact';
import RuleCell from '../../src/components/rules/RuleCell';

describe('<RuleCell>', () => {
  it('snapshot', () => {
    expect(render(<RuleCell />).baseElement).toMatchSnapshot();
  });
});
