import { render } from '@testing-library/preact';
import BeetleRules from '../../src/components/rules/BeetleRules';

describe('<BeetleRules>', () => {
  it('snapshot', () => {
    const Rule = BeetleRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
