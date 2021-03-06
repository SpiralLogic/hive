import { h } from 'preact';
import RuleCell from '../../components/rules/RuleCell';

describe('Rule cell snapshot tests', () => {
  test('snapshot', () => {
    expect(<RuleCell />).toMatchSnapshot();
  });
});
