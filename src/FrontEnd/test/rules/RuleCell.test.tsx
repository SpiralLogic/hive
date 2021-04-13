import { h } from 'preact';
import RuleCell from '../../src/components/rules/RuleCell';

describe('rule cell snapshot tests', () => {
  it('snapshot', () => {
    expect(<RuleCell />).toMatchSnapshot();
  });
});
