import { render } from '@testing-library/preact';
import QueenRules from '../../src/components/rules/QueenRules';

describe('<QueenRules>', () => {
  it('renders', () => {
    const Rule = QueenRules.RuleComponent;
    expect(render(<Rule />).baseElement).toMatchSnapshot();
  });
});
