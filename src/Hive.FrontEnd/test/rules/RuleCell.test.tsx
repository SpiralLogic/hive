import { render } from '@testing-library/preact';
import RuleCell from '../../src/components/rules/RuleCell';

describe('rule cell snapshot tests', () => {
  it('snapshot', () => {
    expect(render(<RuleCell />).baseElement).toMatchSnapshot();
  });
});
