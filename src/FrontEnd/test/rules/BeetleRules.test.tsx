import { h } from 'preact';
import { render } from '@testing-library/preact';
import BeetleRules from '../../src/components/rules/BeetleRules';

describe('beetle Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = BeetleRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
