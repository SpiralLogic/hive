import { h } from 'preact';
import { render } from '@testing-library/preact';

import AntRules from '../../src/components/rules/AntRules';

describe('ant Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = AntRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
