import { render } from '@testing-library/preact';
import SpiderRules from '../../src/components/rules/SpiderRules';

describe('spider Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = SpiderRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
