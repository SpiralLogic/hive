import { render } from '@testing-library/preact';
import SpiderRules from '../../src/components/rules/SpiderRules';

describe('<SpiderRules>', () => {
  it('snapshot', () => {
    const Rule = SpiderRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
