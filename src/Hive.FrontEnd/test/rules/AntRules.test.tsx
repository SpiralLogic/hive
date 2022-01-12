import { render } from '@testing-library/preact';

import AntRules from '../../src/components/rules/AntRules';

describe('<Ant>', () => {
  it('snapshot', () => {
    const Rule = AntRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
