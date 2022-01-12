import { render } from '@testing-library/preact';

import AntRules from '../../src/components/rules/AntRules';

describe('<Ant>', () => {
  it('renders', () => {
    const Rule = AntRules.RuleComponent;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
