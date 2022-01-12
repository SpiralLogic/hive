import { render } from '@testing-library/preact';
import OneHiveRule from '../../src/components/rules/OneHiveRule';

describe('<OneHiveRule>', () => {
  it('snapshot', () => {
    const Rule = OneHiveRule.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
