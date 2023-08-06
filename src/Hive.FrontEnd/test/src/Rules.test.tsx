import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Rules from '../../src/components/Rules';

import Objective from '../../src/components/rules/Objective';
import QueenRules from '../../src/components/rules/QueenRules';
import BeetleRules from '../../src/components/rules/BeetleRules';
import SpiderRules from '../../src/components/rules/SpiderRules';
import GrasshopperRules from '../../src/components/rules/GrasshopperRules';
import AntRules from '../../src/components/rules/AntRules';
import OneHiveRule from '../../src/components/rules/OneHiveRule';
import FreedomToMove from '../../src/components/rules/FreedomToMoveRule';
import { Rule } from '@hive/components/rules/rule';

const renderRules = () => {
  return render(<Rules />);
};

describe('<Rules>', () => {
  it('next button moves next', async () => {
    renderRules();
    await userEvent.click(screen.getByTitle('Next'));

    expect(screen.getByRole('heading')).toHaveTextContent(/Queen/);
  });

  it('prev button goes back to end', async () => {
    renderRules();
    await userEvent.click(screen.getByTitle('Previous'));

    expect(screen.getByRole('heading')).toHaveTextContent(/Freedom To Move/);
  });

  it('prev button moves back', async () => {
    renderRules();
    await userEvent.click(screen.getByTitle('Next'));
    await userEvent.click(screen.getByTitle('Previous'));

    expect(screen.getByRole('heading')).toHaveTextContent(/Objective/);
  });
});

describe('<Rules> snapshots', () => {
  it('matches', () => {
    expect(render(<Rules />)).toMatchSnapshot();
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
