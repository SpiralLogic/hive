import { render } from '@testing-library/preact';
import QueenRules from '../../src/components/rules/QueenRules';

describe('queen Rule snapshot tests', () => {
  it('snapshot', () => {
    const Rule = QueenRules.Rule;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
