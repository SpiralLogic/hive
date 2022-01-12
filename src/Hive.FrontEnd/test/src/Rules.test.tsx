import { ComponentChild } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Rules from '../../src/components/Rules';
import { renderElement } from '../helpers';
import Objective from '../../src/components/rules/Objective';
import QueenRules from '../../src/components/rules/QueenRules';
import BeetleRules from '../../src/components/rules/BeetleRules';
import SpiderRules from '../../src/components/rules/SpiderRules';
import GrasshopperRules from '../../src/components/rules/GrasshopperRules';
import AntRules from '../../src/components/rules/AntRules';
import OneHiveRule from '../../src/components/rules/OneHiveRule';
import FreedomToMove from '../../src/components/rules/FreedomToMoveRule';
import { Rule } from '../../src/components/rules/rule';

describe('<Rules>', () => {
  const renderRules = (): [(ui: ComponentChild) => void, jest.Mock] => {
    const close = jest.fn();
    const { rerender } = render(<Rules />);
    return [rerender, close];
  };

  it('next button moves next', () => {
    const [rerender] = renderRules();
    userEvent.click(screen.getByTitle('Next'));
    rerender(<Rules />);

    expect(screen.getByRole('heading')).toHaveTextContent(/Queen/);
  });

  it('prev button goes back to end', () => {
    const [rerender] = renderRules();
    userEvent.click(screen.getByTitle('Previous'));
    rerender(<Rules />);
    expect(screen.getByRole('heading')).toHaveTextContent(/Freedom To Move/);
  });

  it('prev button moves back', () => {
    const [rerender] = renderRules();
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Previous'));
    rerender(<Rules />);

    expect(screen.getByRole('heading')).toHaveTextContent(/Queen/);
  });

  it('renders', () => {
    expect(renderElement(<Rules />)).toMatchSnapshot();
  });
});

const ruleList = [
  Objective,
  QueenRules,
  BeetleRules,
  SpiderRules,
  GrasshopperRules,
  AntRules,
  OneHiveRule,
  FreedomToMove,
];
describe.each(ruleList.map<[string, Rule]>((rule) => [rule.displayName, rule]))(
  '<%s>',
  (ruleName, RuleComponent) => {
    it(`renders ${ruleName}`, () => {
      expect(render(<RuleComponent />).baseElement).toMatchSnapshot();
    });
  }
);
