import { h } from 'preact';
import { render } from '@testing-library/preact';
import OneHiveRule from '../../src/components/rules/OneHiveRule';

describe('one Hive Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = OneHiveRule.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
